export type BookingStatus =
  | "requested"
  | "confirmed"
  | "seated"
  | "completed"
  | "declined"
  | "cancelled";

export type BookingChannel = "web" | "telegram" | "phone";

export type UserRole = "owner" | "waiter";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

export type Table = {
  id: string;
  name: string;
  capacity: number;
  section: "Main Dining (Comedor)" | "Cider Cellar (Kupelas)" | "Terrace";
};

export type BookingRequest = {
  id: string;
  guestName: string;
  phone: string;
  partySize: number;
  serviceDate: string;
  serviceTime: string;
  channel: BookingChannel;
  status: BookingStatus;
  tableId?: string; // Assigned table (e.g. T1 - T22)
  note: string;
  isNoShow?: boolean;
  vipTag?: boolean;
  totalVisits?: number;
  createdAt: string;
};

export type Schedule = {
  openWeekdays: number[];
  opensAt: string;
  closesAt: string;
  lastBookingTime: string;
  maxCoversPerShift: number; // e.g. 100-120 max covers
};

export type Closure = {
  id: string;
  serviceDate: string;
  reason: string;
};

export type Store = {
  requests: BookingRequest[];
  schedule: Schedule;
  closures: Closure[];
  tables: Table[];
  staff: StaffMember[];
  currentRole: UserRole;
};

export type NewRequest = {
  guestName: string;
  phone: string;
  partySize: number;
  serviceDate: string;
  serviceTime: string;
  note: string;
  channel?: BookingChannel;
};

export const STORAGE_KEY = "iturrieta-booking-store";
export const STORE_EVENT = "iturrieta-store";

export const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function defaultStaff(): StaffMember[] {
  return [
    {
      id: "staff-1",
      name: "Jon Iturrieta",
      email: "jon@iturrieta.eus",
      role: "owner",
      avatar: "👑",
    },
    {
      id: "staff-2",
      name: "Amaia (Floor Waiter)",
      email: "amaia@iturrieta.eus",
      role: "waiter",
      avatar: "🧑‍🍳",
    },
  ];
}

// Default 22 Cider House tables (~100-120 max capacity)
export function defaultTables(): Table[] {
  const tables: Table[] = [];
  // 10 long tables in main stone dining hall
  for (let i = 1; i <= 10; i++) {
    tables.push({
      id: `T${i}`,
      name: `Table ${i}`,
      capacity: i <= 4 ? 4 : 8,
      section: "Main Dining (Comedor)",
    });
  }
  // 6 tables next to Kupelas (Cider barrel barrels)
  for (let i = 11; i <= 16; i++) {
    tables.push({
      id: `T${i}`,
      name: `Kupela Table ${i}`,
      capacity: 6,
      section: "Cider Cellar (Kupelas)",
    });
  }
  // 6 seasonal summer terrace / garden tables
  for (let i = 17; i <= 22; i++) {
    tables.push({
      id: `T${i}`,
      name: `Terrace Table ${i}`,
      capacity: 4,
      section: "Terrace",
    });
  }
  return tables;
}

export function defaultSchedule(): Schedule {
  return {
    openWeekdays: [4, 5, 6, 0], // Thu, Fri, Sat, Sun
    opensAt: "13:00",
    closesAt: "16:00",
    lastBookingTime: "15:30",
    maxCoversPerShift: 100,
  };
}

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function displayDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function weekdayOf(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

function sortWeek(days: number[]): number[] {
  return [...new Set(days)].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
}

function isContiguous(days: number[]): boolean {
  if (days.length <= 1) return true;
  const set = new Set(days);
  const start = days.find((day) => !set.has((day + 6) % 7));
  if (start === undefined) return days.length === 7;
  let cursor = start;
  for (let index = 1; index < days.length; index += 1) {
    cursor = (cursor + 1) % 7;
    if (!set.has(cursor)) return false;
  }
  return true;
}

export function openDayRange(schedule: Schedule): string {
  const days = sortWeek(schedule.openWeekdays);
  if (days.length === 0) return "Closed";
  if (isContiguous(days) && days.length > 1) {
    return `${SHORT_DAYS[days[0]]} to ${SHORT_DAYS[days[days.length - 1]]}`;
  }
  return days.map((day) => SHORT_DAYS[day]).join(", ");
}

export function openDaySentence(schedule: Schedule): string {
  const days = sortWeek(schedule.openWeekdays);
  if (days.length === 0) return "no days";
  const names = days.map((day) => FULL_DAYS[day]);
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(value: number): string {
  const hours = String(Math.floor(value / 60)).padStart(2, "0");
  const minutes = String(value % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function timeOptions(schedule: Schedule): string[] {
  const start = toMinutes(schedule.opensAt);
  const end = toMinutes(schedule.lastBookingTime);
  if (end < start) return [];
  const options: string[] = [];
  for (let cursor = start; cursor <= end; cursor += 30) {
    options.push(fromMinutes(cursor));
  }
  return options;
}

export function closureFor(serviceDate: string, closures: Closure[]): Closure | undefined {
  return closures.find((closure) => closure.serviceDate === serviceDate);
}

export function validateSlot(
  serviceDate: string,
  serviceTime: string,
  schedule: Schedule,
  closures: Closure[]
): string | null {
  if (!serviceDate) return "Please choose a date.";
  if (!serviceTime) return "Please choose a lunch time.";
  if (closureFor(serviceDate, closures)) return "Sidrería Iturrieta is closed on this date.";
  const weekday = weekdayOf(serviceDate);
  if (!schedule.openWeekdays.includes(weekday)) {
    return `We are open on ${openDaySentence(schedule)}.`;
  }
  const times = timeOptions(schedule);
  if (!times.includes(serviceTime)) {
    return `Available lunch service is between ${schedule.opensAt} and ${schedule.lastBookingTime}.`;
  }
  return null;
}

export function validateRequest(
  input: NewRequest,
  schedule: Schedule,
  closures: Closure[]
): string | null {
  if (!input.guestName.trim()) return "Please enter your name.";
  if (!input.phone.trim()) return "Please enter a phone number.";
  if (!input.partySize || input.partySize < 1 || input.partySize > 35) {
    return "Party size must be between 1 and 35 guests.";
  }
  return validateSlot(input.serviceDate, input.serviceTime, schedule, closures);
}

export function defaultSeedRequests(): BookingRequest[] {
  const today = todayIso();
  return [
    {
      id: "seed-1",
      guestName: "Iñaki Otegi",
      phone: "+34 612 345 678",
      partySize: 6,
      serviceDate: today,
      serviceTime: "13:30",
      channel: "web",
      status: "confirmed",
      tableId: "T2",
      vipTag: true,
      totalVisits: 5,
      note: "Family celebration · 2 kids",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "seed-2",
      guestName: "Miren Zubizarreta",
      phone: "+34 689 443 211",
      partySize: 12,
      serviceDate: today,
      serviceTime: "14:00",
      channel: "telegram",
      status: "confirmed",
      tableId: "T11",
      vipTag: false,
      totalVisits: 2,
      note: "Cuadrilla visit · cider tasting directly from kupela",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "seed-3",
      guestName: "Carlos Fernandez",
      phone: "+34 655 889 900",
      partySize: 4,
      serviceDate: today,
      serviceTime: "13:00",
      channel: "web",
      status: "seated",
      tableId: "T1",
      vipTag: false,
      totalVisits: 1,
      note: "High chair needed for toddler",
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: "seed-4",
      guestName: "Ainhoa Etxebarria",
      phone: "+34 644 112 233",
      partySize: 8,
      serviceDate: today,
      serviceTime: "14:30",
      channel: "telegram",
      status: "requested",
      vipTag: true,
      totalVisits: 4,
      note: "Requested via Telegram bot · requires confirmation",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "seed-5",
      guestName: "Jon Arriaga",
      phone: "+34 677 334 455",
      partySize: 4,
      serviceDate: today,
      serviceTime: "13:30",
      channel: "phone",
      status: "requested",
      isNoShow: true, // Repeated no-show warning demonstration
      totalVisits: 3,
      note: "Previous no-show on 12/04 recorded in CRM",
      createdAt: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: "seed-6",
      guestName: "Elena Barandiarán",
      phone: "+34 620 998 877",
      partySize: 10,
      serviceDate: today,
      serviceTime: "15:00",
      channel: "web",
      status: "confirmed",
      tableId: "T12",
      vipTag: false,
      totalVisits: 1,
      note: "Gluten free bread required for 1 guest",
      createdAt: new Date(Date.now() - 400000).toISOString(),
    },
  ];
}

export function defaultStore(): Store {
  return {
    requests: [],
    schedule: defaultSchedule(),
    closures: [],
    tables: defaultTables(),
    staff: defaultStaff(),
    currentRole: "owner",
  };
}

export function readStore(): Store {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = {
        requests: defaultSeedRequests(),
        schedule: defaultSchedule(),
        closures: [],
        tables: defaultTables(),
        staff: defaultStaff(),
        currentRole: "owner" as UserRole,
      };
      writeStore(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      requests: parsed.requests && Array.isArray(parsed.requests) ? parsed.requests : defaultSeedRequests(),
      schedule: parsed.schedule ? { ...defaultSchedule(), ...parsed.schedule } : defaultSchedule(),
      closures: parsed.closures && Array.isArray(parsed.closures) ? parsed.closures : [],
      tables: parsed.tables && Array.isArray(parsed.tables) ? parsed.tables : defaultTables(),
      staff: parsed.staff && Array.isArray(parsed.staff) ? parsed.staff : defaultStaff(),
      currentRole: parsed.currentRole || "owner",
    };
  } catch {
    return defaultStore();
  }
}

export function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function setStaffRole(role: UserRole) {
  const store = readStore();
  writeStore({ ...store, currentRole: role });
}

export function createRequest(input: NewRequest): string | null {
  const store = readStore();
  const error = validateRequest(input, store.schedule, store.closures);
  if (error) return error;
  const request: BookingRequest = {
    id: crypto.randomUUID(),
    guestName: input.guestName.trim(),
    phone: input.phone.trim(),
    partySize: input.partySize,
    serviceDate: input.serviceDate,
    serviceTime: input.serviceTime,
    channel: input.channel || "web",
    status: "requested",
    vipTag: false,
    totalVisits: 1,
    note: input.note.trim(),
    createdAt: new Date().toISOString(),
  };
  writeStore({ ...store, requests: [request, ...store.requests] });
  return null;
}

export function setRequestStatus(id: string, status: BookingStatus) {
  const store = readStore();
  writeStore({
    ...store,
    requests: store.requests.map((request) =>
      request.id === id ? { ...request, status } : request
    ),
  });
}

export function assignTableToBooking(bookingId: string, tableId: string) {
  const store = readStore();
  writeStore({
    ...store,
    requests: store.requests.map((r) =>
      r.id === bookingId ? { ...r, tableId } : r
    ),
  });
}

export function toggleGuestVip(bookingId: string) {
  const store = readStore();
  writeStore({
    ...store,
    requests: store.requests.map((r) =>
      r.id === bookingId ? { ...r, vipTag: !r.vipTag } : r
    ),
  });
}

export function toggleGuestNoShow(bookingId: string) {
  const store = readStore();
  writeStore({
    ...store,
    requests: store.requests.map((r) =>
      r.id === bookingId ? { ...r, isNoShow: !r.isNoShow } : r
    ),
  });
}

export function updateRequestSlot(
  id: string,
  serviceDate: string,
  serviceTime: string
): string | null {
  const store = readStore();
  const error = validateSlot(serviceDate, serviceTime, store.schedule, store.closures);
  if (error) return error;
  writeStore({
    ...store,
    requests: store.requests.map((request) =>
      request.id === id ? { ...request, serviceDate, serviceTime } : request
    ),
  });
  return null;
}

export function saveSchedule(next: Schedule): string | null {
  if (next.openWeekdays.length === 0) return "Keep at least one open day.";
  const opens = toMinutes(next.opensAt);
  const closes = toMinutes(next.closesAt);
  const last = toMinutes(next.lastBookingTime);
  if (opens >= closes) return "The service has to open before it closes.";
  if (last < opens || last > closes) return "The last booking time has to sit inside the service.";
  const store = readStore();
  writeStore({
    ...store,
    schedule: { ...next, openWeekdays: sortWeek(next.openWeekdays) },
  });
  return null;
}

export function closeDay(serviceDate: string, reason: string): string | null {
  if (!serviceDate) return "Choose a date.";
  const store = readStore();
  const next: Closure = {
    id: crypto.randomUUID(),
    serviceDate,
    reason: reason.trim() || "Closed",
  };
  writeStore({
    ...store,
    closures: [...store.closures.filter((c) => c.serviceDate !== serviceDate), next],
  });
  return null;
}

export function reopenDay(serviceDate: string) {
  const store = readStore();
  writeStore({
    ...store,
    closures: store.closures.filter((c) => c.serviceDate !== serviceDate),
  });
}
