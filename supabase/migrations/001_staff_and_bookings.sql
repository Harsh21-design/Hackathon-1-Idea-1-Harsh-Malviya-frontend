-- Reservas Iturrieta: staff auth roles + booking schema

CREATE TYPE public.app_role AS ENUM ('owner', 'waiter');

CREATE TYPE public.booking_status AS ENUM (
  'requested',
  'confirmed',
  'seated',
  'completed',
  'declined',
  'cancelled'
);

CREATE TYPE public.booking_channel AS ENUM ('web', 'telegram', 'phone');

-- ---------------------------------------------------------------------------
-- Profiles (linked to auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'waiter',
  full_name text NOT NULL DEFAULT '',
  avatar text NOT NULL DEFAULT '🧑‍🍳',
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.current_app_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Venue data
-- ---------------------------------------------------------------------------
CREATE TABLE public.restaurant_tables (
  id text PRIMARY KEY,
  name text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  section text NOT NULL
);

CREATE TABLE public.venue_schedule (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  open_weekdays integer[] NOT NULL,
  opens_at time NOT NULL,
  closes_at time NOT NULL,
  last_booking_time time NOT NULL,
  max_covers_per_shift integer NOT NULL CHECK (max_covers_per_shift > 0)
);

CREATE TABLE public.closures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_date date NOT NULL UNIQUE,
  reason text NOT NULL DEFAULT 'Closed'
);

CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  phone text NOT NULL,
  party_size integer NOT NULL CHECK (party_size >= 1 AND party_size <= 35),
  service_date date NOT NULL,
  service_time time NOT NULL,
  channel public.booking_channel NOT NULL DEFAULT 'web',
  status public.booking_status NOT NULL DEFAULT 'requested',
  table_id text REFERENCES public.restaurant_tables (id) ON DELETE SET NULL,
  note text NOT NULL DEFAULT '',
  is_no_show boolean NOT NULL DEFAULT false,
  vip_tag boolean NOT NULL DEFAULT false,
  total_visits integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX booking_requests_service_date_idx ON public.booking_requests (service_date);
CREATE INDEX booking_requests_status_idx ON public.booking_requests (status);

-- ---------------------------------------------------------------------------
-- Seed tables (22)
-- ---------------------------------------------------------------------------
INSERT INTO public.restaurant_tables (id, name, capacity, section) VALUES
  ('T1', 'Table 1', 4, 'Main Dining (Comedor)'),
  ('T2', 'Table 2', 4, 'Main Dining (Comedor)'),
  ('T3', 'Table 3', 4, 'Main Dining (Comedor)'),
  ('T4', 'Table 4', 4, 'Main Dining (Comedor)'),
  ('T5', 'Table 5', 8, 'Main Dining (Comedor)'),
  ('T6', 'Table 6', 8, 'Main Dining (Comedor)'),
  ('T7', 'Table 7', 8, 'Main Dining (Comedor)'),
  ('T8', 'Table 8', 8, 'Main Dining (Comedor)'),
  ('T9', 'Table 9', 8, 'Main Dining (Comedor)'),
  ('T10', 'Table 10', 8, 'Main Dining (Comedor)'),
  ('T11', 'Kupela Table 11', 6, 'Cider Cellar (Kupelas)'),
  ('T12', 'Kupela Table 12', 6, 'Cider Cellar (Kupelas)'),
  ('T13', 'Kupela Table 13', 6, 'Cider Cellar (Kupelas)'),
  ('T14', 'Kupela Table 14', 6, 'Cider Cellar (Kupelas)'),
  ('T15', 'Kupela Table 15', 6, 'Cider Cellar (Kupelas)'),
  ('T16', 'Kupela Table 16', 6, 'Cider Cellar (Kupelas)'),
  ('T17', 'Terrace Table 17', 4, 'Terrace'),
  ('T18', 'Terrace Table 18', 4, 'Terrace'),
  ('T19', 'Terrace Table 19', 4, 'Terrace'),
  ('T20', 'Terrace Table 20', 4, 'Terrace'),
  ('T21', 'Terrace Table 21', 4, 'Terrace'),
  ('T22', 'Terrace Table 22', 4, 'Terrace');

INSERT INTO public.venue_schedule (
  id,
  open_weekdays,
  opens_at,
  closes_at,
  last_booking_time,
  max_covers_per_shift
) VALUES (
  1,
  ARRAY[4, 5, 6, 0],
  '13:00',
  '16:00',
  '15:30',
  100
);

-- Sample bookings for today (demo)
INSERT INTO public.booking_requests (
  guest_name, phone, party_size, service_date, service_time, channel, status,
  table_id, vip_tag, total_visits, note, created_at
) VALUES
  (
    'Iñaki Otegi', '+34 612 345 678', 6, CURRENT_DATE, '13:30', 'web', 'confirmed',
    'T2', true, 5, 'Family celebration · 2 kids', now() - interval '1 hour'
  ),
  (
    'Miren Zubizarreta', '+34 689 443 211', 12, CURRENT_DATE, '14:00', 'telegram', 'confirmed',
    'T11', false, 2, 'Cuadrilla visit · cider tasting directly from kupela', now() - interval '2 hours'
  ),
  (
    'Carlos Fernandez', '+34 655 889 900', 4, CURRENT_DATE, '13:00', 'web', 'seated',
    'T1', false, 1, 'High chair needed for toddler', now() - interval '3 hours'
  ),
  (
    'Ainhoa Etxebarria', '+34 644 112 233', 8, CURRENT_DATE, '14:30', 'telegram', 'requested',
    NULL, true, 4, 'Requested via Telegram bot · requires confirmation', now() - interval '30 minutes'
  ),
  (
    'Jon Arriaga', '+34 677 334 455', 4, CURRENT_DATE, '13:30', 'phone', 'requested',
    NULL, false, 3, 'Previous no-show on 12/04 recorded in CRM', now() - interval '15 minutes'
  ),
  (
    'Elena Barandiarán', '+34 620 998 877', 10, CURRENT_DATE, '15:00', 'web', 'confirmed',
    'T12', false, 1, 'Gluten free bread required for 1 guest', now() - interval '10 minutes'
  );

UPDATE public.booking_requests SET is_no_show = true
WHERE guest_name = 'Jon Arriaga' AND service_date = CURRENT_DATE;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.current_app_role() = 'owner');

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Public read for guest booking form
CREATE POLICY venue_schedule_select_all ON public.venue_schedule
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY closures_select_all ON public.closures
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY restaurant_tables_select_all ON public.restaurant_tables
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY restaurant_tables_update_owner ON public.restaurant_tables
  FOR UPDATE TO authenticated
  USING (public.current_app_role() = 'owner')
  WITH CHECK (public.current_app_role() = 'owner');

-- Schedule & closures: owner only write
CREATE POLICY venue_schedule_update_owner ON public.venue_schedule
  FOR UPDATE TO authenticated
  USING (public.current_app_role() = 'owner')
  WITH CHECK (public.current_app_role() = 'owner');

CREATE POLICY closures_insert_owner ON public.closures
  FOR INSERT TO authenticated
  WITH CHECK (public.current_app_role() = 'owner');

CREATE POLICY closures_update_owner ON public.closures
  FOR UPDATE TO authenticated
  USING (public.current_app_role() = 'owner')
  WITH CHECK (public.current_app_role() = 'owner');

CREATE POLICY closures_delete_owner ON public.closures
  FOR DELETE TO authenticated
  USING (public.current_app_role() = 'owner');

-- Bookings
CREATE POLICY booking_requests_select_staff ON public.booking_requests
  FOR SELECT TO authenticated
  USING (public.current_app_role() IN ('owner', 'waiter'));

CREATE POLICY booking_requests_insert_public ON public.booking_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'requested');

CREATE POLICY booking_requests_update_owner ON public.booking_requests
  FOR UPDATE TO authenticated
  USING (public.current_app_role() = 'owner')
  WITH CHECK (public.current_app_role() = 'owner');

CREATE POLICY booking_requests_update_waiter ON public.booking_requests
  FOR UPDATE TO authenticated
  USING (public.current_app_role() = 'waiter')
  WITH CHECK (public.current_app_role() = 'waiter');

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.closures;
