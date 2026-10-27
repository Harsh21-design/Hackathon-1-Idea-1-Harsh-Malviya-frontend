import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  defaultSchedule,
  defaultTables,
  sortWeek,
  toMinutes,
  validateRequest,
  validateSlot,
  type BookingChannel,
  type BookingRequest,
  type BookingStatus,
  type Closure,
  type NewRequest,
  type Schedule,
  type StaffMember,
  type Store,
  type Table,
  type UserRole,
} from "@/lib/booking-store";

export const BOOKING_REFRESH_EVENT = "iturrieta-booking-refresh";

function notifyRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BOOKING_REFRESH_EVENT));
  }
}

function formatTime(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

type DbBooking = {
  id: string;
  guest_name: string;
  phone: string;
  party_size: number;
  service_date: string;
  service_time: string;
  channel: BookingChannel;
  status: BookingStatus;
  table_id: string | null;
  note: string;
  is_no_show: boolean;
  vip_tag: boolean;
  total_visits: number;
  created_at: string;
};

type DbSchedule = {
  open_weekdays: number[];
  opens_at: string;
  closes_at: string;
  last_booking_time: string;
  max_covers_per_shift: number;
};

type DbClosure = {
  id: string;
  service_date: string;
  reason: string;
};

type DbTable = {
  id: string;
  name: string;
  capacity: number;
  section: Table["section"];
};

type DbProfile = {
  id: string;
  role: UserRole;
  full_name: string;
  avatar: string;
  email: string | null;
};

function mapBooking(row: DbBooking): BookingRequest {
  return {
    id: row.id,
    guestName: row.guest_name,
    phone: row.phone,
    partySize: row.party_size,
    serviceDate: formatDate(row.service_date),
    serviceTime: formatTime(row.service_time),
    channel: row.channel,
    status: row.status,
    tableId: row.table_id ?? undefined,
    note: row.note,
    isNoShow: row.is_no_show,
    vipTag: row.vip_tag,
    totalVisits: row.total_visits,
    createdAt: row.created_at,
  };
}

function mapSchedule(row: DbSchedule | null): Schedule {
  if (!row) return defaultSchedule();
  return {
    openWeekdays: row.open_weekdays,
    opensAt: formatTime(row.opens_at),
    closesAt: formatTime(row.closes_at),
    lastBookingTime: formatTime(row.last_booking_time),
    maxCoversPerShift: row.max_covers_per_shift,
  };
}

function mapClosure(row: DbClosure): Closure {
  return {
    id: row.id,
    serviceDate: formatDate(row.service_date),
    reason: row.reason,
  };
}

function mapTable(row: DbTable): Table {
  return {
    id: row.id,
    name: row.name,
    capacity: row.capacity,
    section: row.section,
  };
}

function mapProfile(row: DbProfile): StaffMember {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email ?? "",
    role: row.role,
    avatar: row.avatar,
  };
}

function getClient(): SupabaseClient {
  return createClient();
}

export async function fetchBookingStore(): Promise<Store> {
  if (!hasSupabaseConfig()) {
    return {
      requests: [],
      schedule: defaultSchedule(),
      closures: [],
      tables: defaultTables(),
      staff: [],
    };
  }

  const supabase = getClient();

  const [scheduleRes, closuresRes, tablesRes] = await Promise.all([
    supabase.from("venue_schedule").select("*").eq("id", 1).maybeSingle(),
    supabase.from("closures").select("*").order("service_date", { ascending: true }),
    supabase.from("restaurant_tables").select("*").order("id", { ascending: true }),
  ]);

  if (scheduleRes.error) throw scheduleRes.error;
  if (closuresRes.error) throw closuresRes.error;
  if (tablesRes.error) throw tablesRes.error;

  const base: Store = {
    requests: [],
    schedule: mapSchedule(scheduleRes.data as DbSchedule | null),
    closures: (closuresRes.data as DbClosure[]).map(mapClosure),
    tables: (tablesRes.data as DbTable[]).length
      ? (tablesRes.data as DbTable[]).map(mapTable)
      : defaultTables(),
    staff: [],
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return base;

  const [bookingsRes, staffRes] = await Promise.all([
    supabase.from("booking_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, role, full_name, avatar, email"),
  ]);

  if (bookingsRes.error) throw bookingsRes.error;
  if (staffRes.error) throw staffRes.error;

  return {
    ...base,
    requests: (bookingsRes.data as DbBooking[]).map(mapBooking),
    staff: (staffRes.data as DbProfile[]).map(mapProfile),
  };
}

export async function subscribeBookingRealtime(onChange: () => void): Promise<() => void> {
  if (!hasSupabaseConfig()) return () => undefined;

  const supabase = getClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return () => undefined;

  const channelId = `booking-store-${Math.random().toString(36).slice(2, 9)}`;
  const channel = supabase.channel(channelId);

  channel
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "booking_requests" },
      () => onChange()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "closures" },
      () => onChange()
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "venue_schedule" },
      () => onChange()
    );

  channel.subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function createBookingRequest(input: NewRequest): Promise<string | null> {
  if (!hasSupabaseConfig()) {
    return "Booking is temporarily unavailable. Please call the cider house.";
  }
  const store = await fetchBookingStore();
  const error = validateRequest(input, store.schedule, store.closures);
  if (error) return error;

  const supabase = getClient();
  const { error: insertError } = await supabase.from("booking_requests").insert({
    guest_name: input.guestName.trim(),
    phone: input.phone.trim(),
    party_size: input.partySize,
    service_date: input.serviceDate,
    service_time: input.serviceTime,
    channel: input.channel ?? "web",
    status: "requested",
    note: input.note.trim(),
    vip_tag: false,
    total_visits: 1,
  });

  if (insertError) return insertError.message;
  notifyRefresh();
  return null;
}

export async function setRequestStatus(id: string, status: BookingStatus): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from("booking_requests").update({ status }).eq("id", id);
  if (error) throw error;
  notifyRefresh();
}

export async function assignTableToBooking(bookingId: string, tableId: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("booking_requests")
    .update({ table_id: tableId })
    .eq("id", bookingId);
  if (error) throw error;
  notifyRefresh();
}

export async function toggleGuestVip(bookingId: string, current: boolean): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("booking_requests")
    .update({ vip_tag: !current })
    .eq("id", bookingId);
  if (error) throw error;
  notifyRefresh();
}

export async function toggleGuestNoShow(bookingId: string, current: boolean): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("booking_requests")
    .update({ is_no_show: !current })
    .eq("id", bookingId);
  if (error) throw error;
  notifyRefresh();
}

export async function updateRequestSlot(
  id: string,
  serviceDate: string,
  serviceTime: string
): Promise<string | null> {
  const store = await fetchBookingStore();
  const error = validateSlot(serviceDate, serviceTime, store.schedule, store.closures);
  if (error) return error;

  const supabase = getClient();
  const { error: updateError } = await supabase
    .from("booking_requests")
    .update({ service_date: serviceDate, service_time: serviceTime })
    .eq("id", id);
  if (updateError) return updateError.message;
  notifyRefresh();
  return null;
}

export async function saveSchedule(next: Schedule): Promise<string | null> {
  if (next.openWeekdays.length === 0) return "Keep at least one open day.";
  const opens = toMinutes(next.opensAt);
  const closes = toMinutes(next.closesAt);
  const last = toMinutes(next.lastBookingTime);
  if (opens >= closes) return "The service has to open before it closes.";
  if (last < opens || last > closes) return "The last booking time has to sit inside the service.";

  const supabase = getClient();
  const { error } = await supabase
    .from("venue_schedule")
    .update({
      open_weekdays: sortWeek(next.openWeekdays),
      opens_at: next.opensAt,
      closes_at: next.closesAt,
      last_booking_time: next.lastBookingTime,
      max_covers_per_shift: next.maxCoversPerShift,
    })
    .eq("id", 1);

  if (error) return error.message;
  notifyRefresh();
  return null;
}

export async function closeDay(serviceDate: string, reason: string): Promise<string | null> {
  if (!serviceDate) return "Choose a date.";
  const supabase = getClient();
  const { error } = await supabase.from("closures").upsert(
    {
      service_date: serviceDate,
      reason: reason.trim() || "Closed",
    },
    { onConflict: "service_date" }
  );
  if (error) return error.message;
  notifyRefresh();
  return null;
}

export async function reopenDay(serviceDate: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from("closures").delete().eq("service_date", serviceDate);
  if (error) throw error;
  notifyRefresh();
}

export async function fetchStaffProfile(userId: string): Promise<StaffMember | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, avatar, email")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapProfile(data as DbProfile);
}
