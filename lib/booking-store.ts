export type BookingStatus = "requested" | "confirmed" | "declined";
export type BookingChannel = "web" | "phone" | "whatsapp";

export type BookingRequest = {
  id: string;
  guestName: string;
  phone: string;
  partySize: number;
  serviceDate: string;
  serviceTime: string;
  channel: BookingChannel;
  status: BookingStatus;
  note: string;
  createdAt: string;
};

export type Schedule = {
  openWeekdays: number[];
  opensAt: string;
  closesAt: string;
  lastBookingTime: string;
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
};

export type NewRequest = {
  guestName: string;
  phone: string;
  partySize: number;
  serviceDate: string;
  serviceTime: string;
  note: string;
};

export const STORAGE_KEY = "iturrieta-booking-store";
export const STORE_EVENT = "iturrieta-store";

const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function defaultSchedule(): Schedule {
  return {
    openWeekdays: [4, 5, 6, 0],
    opensAt: "13:00",
    closesAt: "16:00",
    lastBookingTime: "16:00",
  };
}

export function defaultStore(): Store {
  return { requests: [], schedule: defaultSchedule(), closures: [] };
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

function isTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
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

export function closureFor(isoDate: string, closures: Closure[]): Closure | undefined {
  return closures.find((closure) => closure.serviceDate === isoDate);
}

export function validateSlot(
  serviceDate: string,
  serviceTime: string,
  schedule: Schedule,
  closures: Closure[],
): string | null {
  if (!serviceDate) return "Choose a date.";
  if (serviceDate < todayIso()) return "Choose a coming service day.";
  if (!schedule.openWeekdays.includes(weekdayOf(serviceDate))) {
    return `Iturrieta serves on ${openDaySentence(schedule)}.`;
  }
  const closure = closureFor(serviceDate, closures);
  if (closure) {
    return closure.reason ? `That day is closed. ${closure.reason}` : "That day is closed.";
  }
  if (!serviceTime) return "Choose a time.";
  const time = toMinutes(serviceTime);
  if (time < toMinutes(schedule.opensAt) || time > toMinutes(schedule.lastBookingTime)) {
    return `Ask for a time between ${schedule.opensAt} and ${schedule.lastBookingTime}.`;
  }
  return null;
}

function validateRequest(input: NewRequest, schedule: Schedule, closures: Closure[]): string | null {
  if (!input.guestName.trim()) return "Enter a name.";
  if (input.phone.replace(/\D/g, "").length < 6) return "Enter a phone number.";
  if (!Number.isInteger(input.partySize) || input.partySize < 1 || input.partySize > 24) {
    return "Party size has to be from 1 to 24.";
  }
  return validateSlot(input.serviceDate, input.serviceTime, schedule, closures);
}

function isRequest(value: unknown): value is BookingRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as BookingRequest;
  return (
    typeof request.id === "string" &&
    typeof request.guestName === "string" &&
    typeof request.phone === "string" &&
    typeof request.partySize === "number" &&
    typeof request.serviceDate === "string" &&
    typeof request.serviceTime === "string" &&
    (request.channel === "web" || request.channel === "phone" || request.channel === "whatsapp") &&
    (request.status === "requested" || request.status === "confirmed" || request.status === "declined") &&
    typeof request.note === "string" &&
    typeof request.createdAt === "string"
  );
}

function asSchedule(value: unknown): Schedule {
  const base = defaultSchedule();
  if (!value || typeof value !== "object") return base;
  const schedule = value as Partial<Schedule>;
  const openWeekdays = Array.isArray(schedule.openWeekdays)
    ? schedule.openWeekdays.filter((day): day is number => typeof day === "number" && day >= 0 && day <= 6)
    : base.openWeekdays;
  return {
    openWeekdays: openWeekdays.length > 0 ? sortWeek(openWeekdays) : base.openWeekdays,
    opensAt: isTime(schedule.opensAt) ? schedule.opensAt : base.opensAt,
    closesAt: isTime(schedule.closesAt) ? schedule.closesAt : base.closesAt,
    lastBookingTime: isTime(schedule.lastBookingTime) ? schedule.lastBookingTime : base.lastBookingTime,
  };
}

function asClosures(value: unknown): Closure[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Closure => {
    if (!item || typeof item !== "object") return false;
    const closure = item as Closure;
    return typeof closure.id === "string" && typeof closure.serviceDate === "string" && typeof closure.reason === "string";
  });
}

export function readStore(): Store {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      requests: Array.isArray(parsed.requests) ? parsed.requests.filter(isRequest) : [],
      schedule: asSchedule(parsed.schedule),
      closures: asClosures(parsed.closures),
    };
  } catch {
    return defaultStore();
  }
}

function writeStore(store: Store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(STORE_EVENT));
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
    channel: "web",
    status: "requested",
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
    requests: store.requests.map((request) => (request.id === id ? { ...request, status } : request)),
  });
}

export function updateRequestSlot(id: string, serviceDate: string, serviceTime: string): string | null {
  const store = readStore();
  const error = validateSlot(serviceDate, serviceTime, store.schedule, store.closures);
  if (error) return error;
  writeStore({
    ...store,
    requests: store.requests.map((request) =>
      request.id === id ? { ...request, serviceDate, serviceTime } : request,
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
  writeStore({ ...store, schedule: { ...next, openWeekdays: sortWeek(next.openWeekdays) } });
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
    closures: [...store.closures.filter((closure) => closure.serviceDate !== serviceDate), next],
  });
  return null;
}

export function reopenDay(serviceDate: string) {
  const store = readStore();
  writeStore({
    ...store,
    closures: store.closures.filter((closure) => closure.serviceDate !== serviceDate),
  });
}
