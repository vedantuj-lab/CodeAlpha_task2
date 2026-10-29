-- ====================================================================
-- CALCORA DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Target: Supabase PostgreSQL
-- ====================================================================

-- 1. PROFILES TABLE
-- Extends auth.users. Automatically populated on registration via trigger.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CALCULATION HISTORY TABLE
-- Records authenticated users' calculation expressions and results.
CREATE TABLE IF NOT EXISTS public.calculation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  numeric_result DOUBLE PRECISION,
  mode TEXT NOT NULL DEFAULT 'standard' CHECK (mode IN ('standard', 'scientific')),
  angle_mode TEXT NOT NULL DEFAULT 'deg' CHECK (angle_mode IN ('deg', 'rad')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for speedy retrieval ordered by timestamp
CREATE INDEX IF NOT EXISTS idx_calculation_history_user_created 
  ON public.calculation_history (user_id, created_at DESC);

-- 3. SAVED CALCULATIONS TABLE
-- Allows members to bookmark and name key calculations.
CREATE TABLE IF NOT EXISTS public.saved_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  numeric_result DOUBLE PRECISION,
  mode TEXT NOT NULL DEFAULT 'standard' CHECK (mode IN ('standard', 'scientific')),
  angle_mode TEXT NOT NULL DEFAULT 'deg' CHECK (angle_mode IN ('deg', 'rad')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_saved_calculations_user 
  ON public.saved_calculations (user_id, created_at DESC);

-- 4. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  calculator_mode TEXT NOT NULL DEFAULT 'standard' CHECK (calculator_mode IN ('standard', 'scientific')),
  angle_mode TEXT NOT NULL DEFAULT 'deg' CHECK (angle_mode IN ('deg', 'rad')),
  max_stored_history INTEGER NOT NULL DEFAULT 50 CHECK (max_stored_history BETWEEN 10 AND 500),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ADMINISTRATIVE ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. APP CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.app_config (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  default_theme TEXT NOT NULL DEFAULT 'dark',
  default_calculator_mode TEXT NOT NULL DEFAULT 'standard',
  default_angle_mode TEXT NOT NULL DEFAULT 'deg',
  max_stored_history_entries INTEGER NOT NULL DEFAULT 100,
  enable_scientific_mode BOOLEAN NOT NULL DEFAULT true,
  enable_saved_calculations BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed default global config if empty
INSERT INTO public.app_config (id)
VALUES ('global_config')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Helper security definer function to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- --------------------------------------------------------------------
-- Policies: PROFILES
-- --------------------------------------------------------------------
-- Users can view their own profile; admins can view all profiles
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own display_name, but CANNOT change their own role!
CREATE POLICY "Users can update own display_name"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
  );

-- Admins can update any profile (including role changes)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- --------------------------------------------------------------------
-- Policies: CALCULATION HISTORY
-- --------------------------------------------------------------------
-- Members can only read, insert, delete their own history
CREATE POLICY "Users access own history"
  ON public.calculation_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- Policies: SAVED CALCULATIONS
-- --------------------------------------------------------------------
CREATE POLICY "Users access own saved calculations"
  ON public.saved_calculations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- Policies: USER PREFERENCES
-- --------------------------------------------------------------------
CREATE POLICY "Users access own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- Policies: ADMIN ACTIVITY
-- --------------------------------------------------------------------
-- Only admins can read activity log
CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert activity logs"
  ON public.admin_activity FOR INSERT
  WITH CHECK (public.is_admin() AND auth.uid() = actor_user_id);

-- --------------------------------------------------------------------
-- Policies: APP CONFIG
-- --------------------------------------------------------------------
-- Anyone (including anon) can view app config
CREATE POLICY "Public read app config"
  ON public.app_config FOR SELECT
  USING (true);

-- Only admins can modify app config
CREATE POLICY "Admins can update app config"
  ON public.app_config FOR UPDATE
  USING (public.is_admin());

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'member'
  );

  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
