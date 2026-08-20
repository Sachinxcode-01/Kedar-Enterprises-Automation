-- ==============================================================================
-- KEDAR ENTERPRISES — PRODUCTION DATABASE SCHEMA
-- WhatsApp Automation & Customer Management Foundation
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reusable timestamp trigger function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase Auth users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'STAFF' CHECK (role IN ('ADMIN', 'STAFF')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CUSTOMERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT UNIQUE NOT NULL,
  location TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ------------------------------------------------------------------------------
-- 3. CONVERSATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'PENDING', 'RESOLVED')),
  mode TEXT DEFAULT 'BOT' CHECK (mode IN ('BOT', 'HUMAN')),
  assigned_to UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON public.conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_mode ON public.conversations(mode);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_conversations_assigned_to ON public.conversations(assigned_to);

-- ------------------------------------------------------------------------------
-- 4. MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('INBOUND', 'OUTBOUND')),
  message_type TEXT DEFAULT 'text',
  content TEXT NOT NULL,
  whatsapp_message_id TEXT UNIQUE NULL,
  status TEXT DEFAULT 'SENT' CHECK (status IN ('RECEIVED', 'SENT', 'DELIVERED', 'READ', 'FAILED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_whatsapp_message_id ON public.messages(whatsapp_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- ------------------------------------------------------------------------------
-- 5. LEADS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  requirement TEXT,
  product TEXT,
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST')),
  assigned_to UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_customer_id ON public.leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

-- ------------------------------------------------------------------------------
-- 6. FAQS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. AUTOMATION_RULES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger TEXT NOT NULL,
  configuration JSONB DEFAULT '{}'::jsonb,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. FOLLOWUPS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  template_name TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'SENT', 'FAILED', 'CANCELLED')),
  sent_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followups_scheduled_at ON public.followups(scheduled_at);

-- ------------------------------------------------------------------------------
-- 9. CONSENT_RECORDS TABLE (DPDP Act Compliance)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('GRANTED', 'WITHDRAWN')),
  notice_version TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. DATA_REQUESTS TABLE (DPDP Act Data Principal Requests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.data_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NULL REFERENCES public.customers(id) ON DELETE SET NULL,
  request_type TEXT CHECK (request_type IN ('ACCESS', 'CORRECTION', 'ERASURE', 'CONSENT_WITHDRAWAL', 'GRIEVANCE')),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  description TEXT,
  assigned_to UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolution TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. AUDIT_LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ------------------------------------------------------------------------------
-- ATTACH UPDATED_AT TRIGGERS
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at') THEN
    CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_customers_updated_at') THEN
    CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_conversations_updated_at') THEN
    CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_leads_updated_at') THEN
    CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_faqs_updated_at') THEN
    CREATE TRIGGER trg_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_automation_rules_updated_at') THEN
    CREATE TRIGGER trg_automation_rules_updated_at BEFORE UPDATE ON public.automation_rules FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_data_requests_updated_at') THEN
    CREATE TRIGGER trg_data_requests_updated_at BEFORE UPDATE ON public.data_requests FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY & POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is authenticated staff or admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND active = true AND role IN ('ADMIN', 'STAFF')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND active = true AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for Authenticated Staff/Admin
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
  
  -- Customers
  DROP POLICY IF EXISTS "Staff can access customers" ON public.customers;
  CREATE POLICY "Staff can access customers" ON public.customers FOR ALL USING (public.is_staff_or_admin());
  
  -- Conversations
  DROP POLICY IF EXISTS "Staff can access conversations" ON public.conversations;
  CREATE POLICY "Staff can access conversations" ON public.conversations FOR ALL USING (public.is_staff_or_admin());

  -- Messages
  DROP POLICY IF EXISTS "Staff can access messages" ON public.messages;
  CREATE POLICY "Staff can access messages" ON public.messages FOR ALL USING (public.is_staff_or_admin());

  -- Leads
  DROP POLICY IF EXISTS "Staff can access leads" ON public.leads;
  CREATE POLICY "Staff can access leads" ON public.leads FOR ALL USING (public.is_staff_or_admin());

  -- FAQs
  DROP POLICY IF EXISTS "Staff can manage FAQs" ON public.faqs;
  CREATE POLICY "Staff can manage FAQs" ON public.faqs FOR ALL USING (public.is_staff_or_admin());

  -- Automation Rules
  DROP POLICY IF EXISTS "Admin can manage automation rules" ON public.automation_rules;
  CREATE POLICY "Admin can manage automation rules" ON public.automation_rules FOR ALL USING (public.is_admin());

  -- Followups
  DROP POLICY IF EXISTS "Staff can manage followups" ON public.followups;
  CREATE POLICY "Staff can manage followups" ON public.followups FOR ALL USING (public.is_staff_or_admin());

  -- Consent Records
  DROP POLICY IF EXISTS "Staff can access consent records" ON public.consent_records;
  CREATE POLICY "Staff can access consent records" ON public.consent_records FOR ALL USING (public.is_staff_or_admin());

  -- Data Requests
  DROP POLICY IF EXISTS "Staff can access data requests" ON public.data_requests;
  CREATE POLICY "Staff can access data requests" ON public.data_requests FOR ALL USING (public.is_staff_or_admin());

  -- Audit Logs
  DROP POLICY IF EXISTS "Admin can view audit logs" ON public.audit_logs;
  CREATE POLICY "Admin can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
END $$;
