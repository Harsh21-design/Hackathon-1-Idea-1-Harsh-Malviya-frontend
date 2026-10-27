"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchStaffProfile } from "@/lib/booking-api";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";
import type { StaffMember, UserRole } from "@/lib/booking-store";

export function useStaffSession(): {
  profile: StaffMember | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
} {
  const [profile, setProfile] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!hasSupabaseConfig()) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const staffProfile = await fetchStaffProfile(user.id);
    setProfile(staffProfile);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
    if (!hasSupabaseConfig()) return;
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => subscription.unsubscribe();
  }, [load]);

  const signOut = useCallback(async () => {
    if (!hasSupabaseConfig()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  return {
    profile,
    role: profile?.role ?? null,
    loading,
    signOut,
  };
}
