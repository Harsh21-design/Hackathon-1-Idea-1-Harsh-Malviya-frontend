"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  assignTableToBooking,
  closeDay,
  reopenDay,
  setRequestStatus,
  toggleGuestNoShow,
  toggleGuestVip,
} from "@/lib/booking-api";
import {
  todayIso,
  displayDate,
  type BookingRequest,
  type BookingStatus,
} from "@/lib/booking-store";
import { useBookingStore } from "@/components/use-booking-store";
import { useStaffSession } from "@/components/use-staff-session";

export function AdminDashboard() {
  const router = useRouter();
  const { store, ready, error: storeError } = useBookingStore();
  const { profile, role, loading: sessionLoading, signOut } = useStaffSession();
  const [activeTab, setActiveTab] = useState<"floor" | "crm" | "guests" | "settings">("floor");
  
  // Search & Filters for Reservations CRM
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  // Selected Booking Drawer/Modal state
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  // Blackout date form state
  const [closeDate, setCloseDate] = useState("");
  const [closeReason, setCloseReason] = useState("");

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (!ready || sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-stone-600">
        <p className="font-serif text-lg animate-pulse">Loading Iturrieta Hospitality OS...</p>
      </div>
    );
  }

  if (!profile || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5] px-6 text-center text-stone-600">
        <div className="max-w-md space-y-3">
          <p className="font-serif text-xl font-bold text-stone-900">Staff profile not found</p>
          <p className="text-sm">
            Your account is signed in but has no role in Iturrieta OS. Ask the owner to add you in Supabase.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-stone-800"
            >
              Sign Out & Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = role === "owner";

  const today = todayIso();
  const todaysBookings = store.requests.filter((r) => r.serviceDate === today);
  const todaysCovers = todaysBookings
    .filter((r) => r.status === "confirmed" || r.status === "seated")
    .reduce((sum, r) => sum + r.partySize, 0);
  const pendingRequests = store.requests.filter((r) => r.status === "requested");
  const seatedCount = todaysBookings.filter((b) => b.status === "seated").length;

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await setRequestStatus(id, status);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch {
      // RLS or network errors surface on next refetch
    }
  };

  const handleTableAssign = async (bookingId: string, tableId: string) => {
    try {
      await assignTableToBooking(bookingId, tableId);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, tableId: tableId || undefined });
      }
    } catch {
      // ignored
    }
  };

  const handleToggleVip = async (booking: BookingRequest) => {
    if (!isOwner) return;
    try {
      await toggleGuestVip(booking.id, Boolean(booking.vipTag));
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking({ ...selectedBooking, vipTag: !booking.vipTag });
      }
    } catch {
      // ignored
    }
  };

  const handleToggleNoShow = async (booking: BookingRequest) => {
    if (!isOwner) return;
    try {
      await toggleGuestNoShow(booking.id, Boolean(booking.isNoShow));
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking({ ...selectedBooking, isNoShow: !booking.isNoShow });
      }
    } catch {
      // ignored
    }
  };

  const handleAddClosure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeDate) return;
    const result = await closeDay(closeDate, closeReason);
    if (!result) {
      setCloseDate("");
      setCloseReason("");
    }
  };

  // Filtered requests
  const filteredRequests = store.requests.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesChannel = channelFilter === "all" || r.channel === channelFilter;
    return matchesSearch && matchesStatus && matchesChannel;
  });

  return (
    <div className="flex min-h-screen bg-[#f8f6f0] text-stone-900 font-sans antialiased">
      
      {/* ============================================================== */}
      {/* 1. PROFESSIONAL HOSPITALITY CRM SIDEBAR */}
      {/* ============================================================== */}
      <aside className="w-64 border-r border-stone-200/90 bg-[#1e2420] text-stone-200 flex flex-col shrink-0 select-none">
        
        {/* Brand identity */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="group flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              Iturrieta OS
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/80">
              Cider House CRM · 1998
            </span>
          </Link>
        </div>

        {/* ACTIVE ROLE SELECTOR / BADGE (Owner vs Floor Waiter) */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Active Session
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isOwner ? "bg-amber-400 text-stone-950" : "bg-emerald-400 text-stone-950"
            }`}>
              {isOwner ? "Owner (Full Admin)" : "Floor Waiter"}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="h-8 w-8 rounded-full bg-stone-700 flex items-center justify-center text-sm shadow-xs">
              {profile.avatar}
            </div>
            <div className="text-xs">
              <p className="font-bold text-white leading-tight">{profile.name}</p>
              <p className="text-[11px] text-stone-400">
                {isOwner ? "Owner & Director" : "Live Floor Host"}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-lg border border-white/15 py-2 text-[10px] font-bold text-stone-300 transition hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* NAVIGATION CRM MENU */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 text-xs font-semibold">
          
          {/* Floor Ops - Available to BOTH */}
          <button
            onClick={() => setActiveTab("floor")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
              activeTab === "floor"
                ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                : "text-stone-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">🍽️</span>
              <span>Live Floor Operations</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === "floor" ? "bg-stone-950 text-white" : "bg-white/10 text-stone-300"
            }`}>
              {todaysBookings.length}
            </span>
          </button>

          {/* Reservations CRM - Available to BOTH (Owner can approve, Waiter can view) */}
          <button
            onClick={() => setActiveTab("crm")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
              activeTab === "crm"
                ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                : "text-stone-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">📋</span>
              <span>Reservations CRM</span>
            </div>
            {pendingRequests.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>

          {/* Guest CRM Directory - Owner Only */}
          <button
            onClick={() => {
              if (isOwner) setActiveTab("guests");
            }}
            disabled={!isOwner}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
              activeTab === "guests"
                ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                : isOwner
                ? "text-stone-300 hover:bg-white/5 hover:text-white"
                : "text-stone-500 opacity-40 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">👥</span>
              <span>Guest Directory</span>
            </div>
            {!isOwner && <span className="text-[9px] font-bold text-amber-300">LOCK</span>}
          </button>

          {/* Shift & House Settings - Owner Only */}
          <button
            onClick={() => {
              if (isOwner) setActiveTab("settings");
            }}
            disabled={!isOwner}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
              activeTab === "settings"
                ? "bg-amber-400 text-stone-950 font-bold shadow-md"
                : isOwner
                ? "text-stone-300 hover:bg-white/5 hover:text-white"
                : "text-stone-500 opacity-40 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">⚙️</span>
              <span>House Settings & Shifts</span>
            </div>
            {!isOwner && <span className="text-[9px] font-bold text-amber-300">LOCK</span>}
          </button>
        </nav>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-white/10 text-xs flex items-center justify-between text-stone-400">
          <Link href="/" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <span>←</span>
            <span>Back to Website</span>
          </Link>
          <span className="text-[10px] text-stone-500">v2.4 Pro</span>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN CRM CONTENT AREA */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Control Bar */}
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 px-8 py-4 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gold">
              Sidrería Iturrieta · Aramaio
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-sm font-bold text-stone-900 capitalize">
              {activeTab === "floor" && "Live Floor Operations (Waiter & Host Screen)"}
              {activeTab === "crm" && "Reservations Management & Inflow Pipeline"}
              {activeTab === "guests" && "Guest History & CRM Profiles"}
              {activeTab === "settings" && "Owner Settings & Operations Controls"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Live Service Pulse Indicator */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Shift Active: 13:00 – 16:00</span>
            </div>

            {/* Inflow indicator */}
            <div className="hidden sm:flex items-center gap-2 text-stone-500">
              <span>Covers:</span>
              <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                {todaysCovers} / {store.schedule.maxCoversPerShift}
              </span>
            </div>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <main className="p-8 space-y-8 flex-1">
          {storeError && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
              {storeError}
            </p>
          )}

          {/* ============================================================ */}
          {/* TAB 1: LIVE FLOOR OPS (Waiter & Staff View) */}
          {/* ============================================================ */}
          {activeTab === "floor" && (
            <div className="space-y-8">
              
              {/* Header Title & Brief statement */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-stone-900">
                    Live Floor Operations ({displayDate(today)})
                  </h1>
                  <p className="mt-1 text-xs text-stone-500">
                    &ldquo;Staff run the floor in real time&rdquo; · Quick seating, table status, and shift turnover.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-stone-500">Role view:</span>
                  <span className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 shadow-xs">
                    {isOwner ? "👑 Admin Access" : "🧑‍🍳 Floor Host Mode"}
                  </span>
                </div>
              </div>

              {/* 4 Metric CRM Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold uppercase tracking-wider">Booked Covers</span>
                    <span className="text-gold font-bold">Today</span>
                  </div>
                  <p className="mt-3 font-serif text-3xl font-bold text-stone-900">
                    {todaysCovers}
                    <span className="text-base text-stone-400 font-normal"> / {store.schedule.maxCoversPerShift}</span>
                  </p>
                  <div className="mt-2 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${Math.min(100, (todaysCovers / store.schedule.maxCoversPerShift) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold uppercase tracking-wider">Currently Dining</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="mt-3 font-serif text-3xl font-bold text-emerald-600">
                    {seatedCount} <span className="text-base text-stone-400 font-normal">Tables</span>
                  </p>
                  <p className="mt-1 text-[11px] text-stone-500">Active dining & txotx tasting</p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold uppercase tracking-wider">Expected Arrivals</span>
                    <span className="text-amber-500 font-bold">Upcoming</span>
                  </div>
                  <p className="mt-3 font-serif text-3xl font-bold text-amber-600">
                    {todaysBookings.filter((b) => b.status === "confirmed").length} <span className="text-base text-stone-400 font-normal">Tables</span>
                  </p>
                  <p className="mt-1 text-[11px] text-stone-500">Confirmed for today&apos;s lunch</p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold uppercase tracking-wider">Turnover Capacity</span>
                    <span className="text-stone-400">Total</span>
                  </div>
                  <p className="mt-3 font-serif text-3xl font-bold text-stone-800">
                    {22 - todaysBookings.filter((b) => b.status === "seated" || b.status === "confirmed").length}
                    <span className="text-base text-stone-400 font-normal"> / 22 Free</span>
                  </p>
                  <p className="mt-1 text-[11px] text-stone-500">Across Comedor, Kupelas & Terrace</p>
                </div>
              </div>

              {/* 22 TABLES ARRANGED BY RESTAURANT SECTIONS */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Floor Map & Table Allocations (22 Tables)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Click any occupied table to view guest profile or change seating status.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-md bg-stone-100 border border-stone-300" />
                      <span>Free</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-md bg-amber-400" />
                      <span>Reserved</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-md bg-emerald-500" />
                      <span>Seated</span>
                    </span>
                  </div>
                </div>

                {/* Section 1: Main Stone Dining Hall (Tables 1-10) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold">
                      Section A: Main Stone Dining Hall (Comedor) · Tables 1–10
                    </span>
                    <span className="text-[11px] text-stone-400">Long Basque Benches</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                    {store.tables.slice(0, 10).map((tbl) => {
                      const assigned = todaysBookings.find(
                        (b) => b.tableId === tbl.id && (b.status === "confirmed" || b.status === "seated")
                      );
                      const isSeated = assigned?.status === "seated";
                      const isReserved = assigned?.status === "confirmed";

                      return (
                        <div
                          key={tbl.id}
                          onClick={() => assigned && setSelectedBooking(assigned)}
                          className={`rounded-2xl p-3 border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                            isSeated
                              ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-400/30"
                              : isReserved
                              ? "border-amber-400 bg-amber-50 text-amber-950 shadow-xs"
                              : "border-stone-200 bg-stone-50/70 text-stone-500 hover:border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>{tbl.id}</span>
                            <span className="text-[10px] text-stone-400">{tbl.capacity}p</span>
                          </div>
                          <div className="my-2">
                            {assigned ? (
                              <>
                                <p className="font-bold truncate text-[11px]">{assigned.guestName}</p>
                                <p className="text-[10px] opacity-75">{assigned.serviceTime} · {assigned.partySize}p</p>
                              </>
                            ) : (
                              <p className="text-[10px] text-stone-400 italic">Available</p>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md text-center ${
                            isSeated ? "bg-emerald-200 text-emerald-800" : isReserved ? "bg-amber-200 text-amber-800" : "bg-stone-200/60 text-stone-600"
                          }`}>
                            {isSeated ? "Dining" : isReserved ? "Reserved" : "Free"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Kupelas Cellar (Tables 11-16) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold">
                      Section B: Cider Barrel Cellar (Kupelas) · Tables 11–16
                    </span>
                    <span className="text-[11px] text-stone-400">Direct barrel txotx proximity</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {store.tables.slice(10, 16).map((tbl) => {
                      const assigned = todaysBookings.find(
                        (b) => b.tableId === tbl.id && (b.status === "confirmed" || b.status === "seated")
                      );
                      const isSeated = assigned?.status === "seated";
                      const isReserved = assigned?.status === "confirmed";

                      return (
                        <div
                          key={tbl.id}
                          onClick={() => assigned && setSelectedBooking(assigned)}
                          className={`rounded-2xl p-3 border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                            isSeated
                              ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-400/30"
                              : isReserved
                              ? "border-amber-400 bg-amber-50 text-amber-950 shadow-xs"
                              : "border-stone-200 bg-stone-50/70 text-stone-500 hover:border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>{tbl.id}</span>
                            <span className="text-[10px] text-stone-400">{tbl.capacity}p</span>
                          </div>
                          <div className="my-2">
                            {assigned ? (
                              <>
                                <p className="font-bold truncate text-[11px]">{assigned.guestName}</p>
                                <p className="text-[10px] opacity-75">{assigned.serviceTime} · {assigned.partySize}p</p>
                              </>
                            ) : (
                              <p className="text-[10px] text-stone-400 italic">Available</p>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md text-center ${
                            isSeated ? "bg-emerald-200 text-emerald-800" : isReserved ? "bg-amber-200 text-amber-800" : "bg-stone-200/60 text-stone-600"
                          }`}>
                            {isSeated ? "Dining" : isReserved ? "Reserved" : "Free"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Terrace & Summer Garden (Tables 17-22) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold">
                      Section C: Summer Terrace & Orchard · Tables 17–22
                    </span>
                    <span className="text-[11px] text-stone-400">Valley Views</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {store.tables.slice(16, 22).map((tbl) => {
                      const assigned = todaysBookings.find(
                        (b) => b.tableId === tbl.id && (b.status === "confirmed" || b.status === "seated")
                      );
                      const isSeated = assigned?.status === "seated";
                      const isReserved = assigned?.status === "confirmed";

                      return (
                        <div
                          key={tbl.id}
                          onClick={() => assigned && setSelectedBooking(assigned)}
                          className={`rounded-2xl p-3 border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                            isSeated
                              ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-400/30"
                              : isReserved
                              ? "border-amber-400 bg-amber-50 text-amber-950 shadow-xs"
                              : "border-stone-200 bg-stone-50/70 text-stone-500 hover:border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>{tbl.id}</span>
                            <span className="text-[10px] text-stone-400">{tbl.capacity}p</span>
                          </div>
                          <div className="my-2">
                            {assigned ? (
                              <>
                                <p className="font-bold truncate text-[11px]">{assigned.guestName}</p>
                                <p className="text-[10px] opacity-75">{assigned.serviceTime} · {assigned.partySize}p</p>
                              </>
                            ) : (
                              <p className="text-[10px] text-stone-400 italic">Available</p>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md text-center ${
                            isSeated ? "bg-emerald-200 text-emerald-800" : isReserved ? "bg-amber-200 text-amber-800" : "bg-stone-200/60 text-stone-600"
                          }`}>
                            {isSeated ? "Dining" : isReserved ? "Reserved" : "Free"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Today's Active Orders / Timeline List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Floor Schedule & Waiter Action Cards
                  </h3>
                  <span className="text-xs text-stone-500">Sorted by lunch slot</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {todaysBookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div>
                        {/* Header time + tags */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-lg font-bold text-stone-900">
                            {b.serviceTime}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {b.vipTag && (
                              <span className="rounded-md bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                                ★ VIP
                              </span>
                            )}
                            {b.isNoShow && (
                              <span className="rounded-md bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
                                ⚠️ No-Show Risk
                              </span>
                            )}
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              b.channel === "telegram" ? "bg-sky-100 text-sky-800" : "bg-stone-100 text-stone-700"
                            }`}>
                              {b.channel}
                            </span>
                          </div>
                        </div>

                        {/* Guest details */}
                        <div className="mt-3">
                          <div className="flex items-baseline justify-between">
                            <p className="font-serif text-lg font-bold text-stone-900">{b.guestName}</p>
                            <span className="font-bold text-xs text-stone-600">{b.partySize} Guests</span>
                          </div>
                          <p className="text-xs text-stone-400">{b.phone}</p>
                          {b.note && (
                            <p className="mt-2 rounded-lg bg-stone-50 p-2 text-xs text-stone-600 italic">
                              &ldquo;{b.note}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Assigned Table */}
                        <div className="mt-4 flex items-center justify-between text-xs">
                          <span className="text-stone-500 font-medium">Table Assignment:</span>
                          <select
                            value={b.tableId || ""}
                            onChange={(e) => handleTableAssign(b.id, e.target.value)}
                            className="rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-bold text-stone-800"
                          >
                            <option value="">Unassigned</option>
                            {store.tables.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.id} ({t.name} · {t.capacity}p)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Waiter Actions */}
                      <div className="mt-5 pt-4 border-t border-stone-100">
                        {b.status === "confirmed" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(b.id, "seated")}
                              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                            >
                              ✓ Seat Guest Now
                            </button>
                            <button
                              onClick={() => handleStatusChange(b.id, "cancelled")}
                              className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {b.status === "seated" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(b.id, "completed")}
                              className="flex-1 rounded-xl bg-stone-900 py-2 text-xs font-bold text-white hover:bg-black transition-colors"
                            >
                              ✓ Mark Completed (Table Finished)
                            </button>
                          </div>
                        )}

                        {b.status === "requested" && isOwner && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => void handleStatusChange(b.id, "confirmed")}
                              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => void handleStatusChange(b.id, "declined")}
                              className="rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                        {b.status === "requested" && !isOwner && (
                          <span className="text-xs text-amber-800 font-bold block text-center py-1">
                            Pending owner confirmation
                          </span>
                        )}

                        {b.status === "completed" && (
                          <span className="text-xs text-stone-400 font-bold block text-center py-1">
                            ✓ Dining Completed
                          </span>
                        )}
                        {b.status === "declined" && (
                          <span className="text-xs text-rose-600 font-bold block text-center py-1">
                            Declined
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: RESERVATIONS CRM (Master Inflow Pipeline) */}
          {/* ============================================================ */}
          {activeTab === "crm" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-stone-900">
                    Reservations Master CRM
                  </h1>
                  <p className="mt-1 text-xs text-stone-500">
                    Unified multi-channel booking inflow: Web (Online Form) & Telegram AI Bot.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                    Total: {filteredRequests.length} bookings
                  </span>
                </div>
              </div>

              {/* CRM Filters & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search guest name, phone, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs text-stone-800 outline-none focus:border-gold"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Status filter pills */}
                  <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1 text-xs">
                    {["all", "requested", "confirmed", "seated", "completed", "declined"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition-all ${
                          statusFilter === s ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Channel filter */}
                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value)}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 outline-none"
                  >
                    <option value="all">All Channels</option>
                    <option value="web">Web Form</option>
                    <option value="telegram">Telegram Bot</option>
                  </select>
                </div>
              </div>

              {/* Master CRM Table */}
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fbf9f5] text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-4 px-5">Date & Slot</th>
                        <th className="py-4 px-5">Guest Profile</th>
                        <th className="py-4 px-5">Guests</th>
                        <th className="py-4 px-5">Channel</th>
                        <th className="py-4 px-5">CRM Tags</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5">Assigned Table</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
                      {filteredRequests.map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                          onClick={() => setSelectedBooking(r)}
                        >
                          <td className="py-3.5 px-5 font-mono">
                            <span className="font-bold text-stone-900">{r.serviceTime}</span>
                            <span className="block text-[11px] text-stone-400">{displayDate(r.serviceDate)}</span>
                          </td>
                          <td className="py-3.5 px-5">
                            <p className="font-bold text-stone-900 text-sm">{r.guestName}</p>
                            <p className="text-[11px] text-stone-400">{r.phone}</p>
                          </td>
                          <td className="py-3.5 px-5 font-bold text-sm">
                            {r.partySize}p
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              r.channel === "telegram" ? "bg-sky-100 text-sky-800" : "bg-stone-100 text-stone-700"
                            }`}>
                              {r.channel}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {isOwner &&
                                (r.vipTag ? (
                                  <button
                                    onClick={() => handleToggleVip(r)}
                                    className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 hover:bg-amber-200"
                                  >
                                    ★ VIP
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleVip(r)}
                                    className="text-[10px] text-stone-400 hover:text-amber-500"
                                  >
                                    + VIP
                                  </button>
                                ))}

                              {r.isNoShow && (
                                <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                                  No-Show
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                              r.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                              r.status === "seated" ? "bg-emerald-500 text-white" :
                              r.status === "requested" ? "bg-amber-100 text-amber-900 font-bold" :
                              r.status === "declined" ? "bg-rose-100 text-rose-800" :
                              "bg-stone-100 text-stone-700"
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={r.tableId || ""}
                              onChange={(e) => handleTableAssign(r.id, e.target.value)}
                              className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs outline-none font-bold"
                            >
                              <option value="">Unassigned</option>
                              {store.tables.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.id} ({t.name})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 px-5 text-right space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {r.status === "requested" && isOwner && (
                              <>
                                <button
                                  onClick={() => void handleStatusChange(r.id, "confirmed")}
                                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => void handleStatusChange(r.id, "declined")}
                                  className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-[11px] font-bold text-stone-600 hover:bg-stone-100"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {r.status === "confirmed" && (
                              <button
                                onClick={() => handleStatusChange(r.id, "seated")}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700"
                              >
                                Seat
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: GUEST DIRECTORY CRM (Owner Access Only) */}
          {/* ============================================================ */}
          {activeTab === "guests" && isOwner && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-stone-900">
                  Guest CRM & Customer History
                </h1>
                <p className="mt-1 text-xs text-stone-500">
                  Identify loyal cuadrillas, VIP regulars, and manage no-show flags.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {store.requests.map((g) => (
                  <div key={g.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center font-serif font-bold text-stone-700">
                          {g.guestName.charAt(0)}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-stone-900">{g.guestName}</p>
                          <p className="text-[11px] text-stone-400">{g.phone}</p>
                        </div>
                      </div>
                      {g.vipTag && (
                        <span className="rounded-md bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                          VIP Regular
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                      <span className="text-stone-500">Total Recorded Visits:</span>
                      <span className="font-bold text-stone-800">{g.totalVisits || 1} visits</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        onClick={() => handleToggleVip(g)}
                        className="flex-1 rounded-lg border border-amber-300 bg-[#faefe4] py-1 text-[11px] font-bold text-gold hover:bg-amber-100"
                      >
                        {g.vipTag ? "Remove VIP" : "Mark as VIP"}
                      </button>
                      <button
                        onClick={() => handleToggleNoShow(g)}
                        className={`flex-1 rounded-lg py-1 text-[11px] font-bold border ${
                          g.isNoShow
                            ? "border-rose-300 bg-rose-50 text-rose-700"
                            : "border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {g.isNoShow ? "Clear No-Show" : "Flag No-Show"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: OWNER SETTINGS & OPERATIONS (Owner Access Only) */}
          {/* ============================================================ */}
          {activeTab === "settings" && isOwner && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h1 className="font-serif text-3xl font-bold text-stone-900">
                  House Settings & Shift Controls
                </h1>
                <p className="mt-1 text-xs text-stone-500">
                  &ldquo;The owners control everything, from anywhere&rdquo; · Capacity, blackout dates, and service shifts.
                </p>
              </div>

              {/* Service Shifts & Capacity */}
              <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-xs">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Lunch Shift Configuration
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  Standard Basque cider-house schedule (Thursday – Sunday)
                </p>

                <div className="mt-6 grid gap-6 sm:grid-cols-3 text-xs">
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                    <span className="font-bold text-stone-600 uppercase">Service Opens</span>
                    <p className="mt-2 font-mono text-2xl font-bold text-stone-900">{store.schedule.opensAt}</p>
                    <span className="text-[10px] text-stone-400">First seating</span>
                  </div>
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                    <span className="font-bold text-stone-600 uppercase">Last Seating</span>
                    <p className="mt-2 font-mono text-2xl font-bold text-stone-900">{store.schedule.lastBookingTime}</p>
                    <span className="text-[10px] text-stone-400">Closes at 16:00</span>
                  </div>
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                    <span className="font-bold text-stone-600 uppercase">Max Shift Covers</span>
                    <p className="mt-2 font-mono text-2xl font-bold text-gold">{store.schedule.maxCoversPerShift} guests</p>
                    <span className="text-[10px] text-stone-400">Capacity threshold</span>
                  </div>
                </div>
              </div>

              {/* Blackout Dates / Closures */}
              <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-xs">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Temporary Closures & Blackout Dates
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  Block dates for cellar maintenance, private weddings, or seasonal harvest.
                </p>

                <form onSubmit={handleAddClosure} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <input
                    type="date"
                    value={closeDate}
                    onChange={(e) => setCloseDate(e.target.value)}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Reason (e.g. Kupela Cellar Maintenance)"
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                    className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gold px-5 py-2 text-xs font-bold text-white hover:bg-gold-bright transition-colors"
                  >
                    Add Blackout Date
                  </button>
                </form>

                {/* List of blackout dates */}
                <div className="mt-6 divide-y divide-stone-100">
                  {store.closures.length === 0 ? (
                    <p className="text-xs text-stone-400 italic py-2">No blackout closures active.</p>
                  ) : (
                    store.closures.map((c) => (
                      <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-stone-900">{displayDate(c.serviceDate)}</span>
                          <span className="ml-2 text-stone-500">({c.reason})</span>
                        </div>
                        <button
                          onClick={() => void reopenDay(c.serviceDate)}
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          Reopen Date
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================== */}
      {/* 3. GUEST PROFILE CRM SIDE-DRAWER (When a booking is clicked) */}
      {/* ============================================================== */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  Guest CRM Profile
                </span>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-lg p-1 text-stone-400 hover:text-stone-800"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-12 w-12 rounded-2xl bg-[#faefe4] text-gold flex items-center justify-center font-serif text-xl font-bold">
                    {selectedBooking.guestName.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {selectedBooking.guestName}
                    </h3>
                    <a href={`tel:${selectedBooking.phone}`} className="text-xs text-stone-500 hover:text-gold">
                      {selectedBooking.phone}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Party Size</span>
                    <p className="font-bold text-stone-900 text-sm mt-0.5">{selectedBooking.partySize} Guests</p>
                  </div>
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Channel</span>
                    <p className="font-bold text-stone-900 text-sm mt-0.5 uppercase">{selectedBooking.channel}</p>
                  </div>
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Service Slot</span>
                    <p className="font-bold text-stone-900 text-sm mt-0.5">{selectedBooking.serviceTime}</p>
                  </div>
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Current Status</span>
                    <p className="font-bold text-emerald-600 text-sm mt-0.5 capitalize">{selectedBooking.status}</p>
                  </div>
                </div>

                {selectedBooking.note && (
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-3 text-xs">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Special Dietary / Notes</span>
                    <p className="mt-1 text-stone-700 italic">&ldquo;{selectedBooking.note}&rdquo;</p>
                  </div>
                )}

                {/* Table assignment */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-stone-700">Assign Table:</label>
                  <select
                    value={selectedBooking.tableId || ""}
                    onChange={(e) => handleTableAssign(selectedBooking.id, e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-bold text-stone-800"
                  >
                    <option value="">Unassigned</option>
                    {store.tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} ({t.name} · {t.capacity}p · {t.section})
                      </option>
                    ))}
                  </select>
                </div>

                {/* CRM Flags */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleToggleVip(selectedBooking)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-colors ${
                      selectedBooking.vipTag ? "border-amber-400 bg-amber-50 text-amber-900" : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    ★ {selectedBooking.vipTag ? "VIP Regular" : "Set VIP"}
                  </button>
                  <button
                    onClick={() => handleToggleNoShow(selectedBooking)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-colors ${
                      selectedBooking.isNoShow ? "border-rose-400 bg-rose-50 text-rose-700" : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    ⚠️ {selectedBooking.isNoShow ? "No-Show Flagged" : "Flag No-Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick status actions at bottom */}
            <div className="border-t border-stone-100 pt-4 space-y-2">
              <div className="flex gap-2">
                {isOwner && (
                  <button
                    onClick={() => void handleStatusChange(selectedBooking.id, "confirmed")}
                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Confirm Table
                  </button>
                )}
                <button
                  onClick={() => void handleStatusChange(selectedBooking.id, "seated")}
                  className="flex-1 rounded-xl bg-gold py-2.5 text-xs font-bold text-white hover:bg-gold-bright"
                >
                  Seat Guest
                </button>
              </div>
              <button
                onClick={() => handleStatusChange(selectedBooking.id, "completed")}
                className="w-full rounded-xl bg-stone-900 py-2.5 text-xs font-bold text-white hover:bg-black"
              >
                Complete Dining (Free Table)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
