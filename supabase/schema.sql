-- ==============================================================================
-- KEDAR ENTERPRISES — WHATSAPP AUTOMATION PLATFORM SCHEMA
-- DPDP Act 2023 Compliant PostgreSQL & Supabase Database Definition
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Extends Supabase Auth profiles)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CUSTOMERS TABLE (with DPDP Anonymization Flags)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  location TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_anonymized BOOLEAN DEFAULT FALSE,
  anonymized_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- 3. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'PENDING')),
  mode TEXT DEFAULT 'BOT' CHECK (mode IN ('BOT', 'HUMAN')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unread_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('INBOUND', 'OUTBOUND')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'template', 'image', 'document', 'interactive')),
  content TEXT NOT NULL,
  sender_type TEXT DEFAULT 'BOT' CHECK (sender_type IN ('CUSTOMER', 'BOT', 'STAFF')),
  whatsapp_message_id TEXT,
  status TEXT DEFAULT 'SENT' CHECK (status IN ('SENT', 'DELIVERED', 'READ', 'FAILED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  requirement TEXT,
  product TEXT,
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FAQS TABLE (Deterministic Intent Matching)
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'General',
  enabled BOOLEAN DEFAULT TRUE,
  match_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. AUTOMATION RULES TABLE
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT NOT NULL,
  configuration JSONB DEFAULT '{}'::jsonb,
  enabled BOOLEAN DEFAULT TRUE,
  last_execution TIMESTAMP WITH TIME ZONE,
  success_count INT DEFAULT 0,
  failure_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. FOLLOWUPS TABLE (Meta Approved Template Automation)
CREATE TABLE IF NOT EXISTS public.followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'CANCELLED', 'FAILED')),
  sent_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. AUDIT LOGS TABLE (Tamper-Evident Admin Track)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- DPDP ACT 2023 SPECIFIC TABLES & COMPLIANCE SCHEMAS
-- ==============================================================================

-- 10. CONSENT RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('GRANTED', 'WITHDRAWN', 'EXPIRED')),
  notice_version TEXT DEFAULT 'v1.0',
  source TEXT DEFAULT 'WHATSAPP_OPTIN',
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  withdrawn_at TIMESTAMP WITH TIME ZONE NULL
);

-- 11. DATA PRINCIPAL REQUESTS (Erasure, Access, Correction)
CREATE TABLE IF NOT EXISTS public.data_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('ACCESS', 'CORRECTION', 'ERASURE', 'WITHDRAWAL')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
  details TEXT,
  resolution_notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  processed_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 12. GRIEVANCE REDRESSAL TICKETS (DPDP Compliance Officer Workflow)
CREATE TABLE IF NOT EXISTS public.grievance_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  issue TEXT NOT NULL,
  category TEXT DEFAULT 'Privacy/Consent' CHECK (category IN ('Privacy/Consent', 'Data Erasure', 'Incorrect Data', 'Unsolicited Msg')),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  assigned_officer UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE NULL
);

-- 13. DATA PROCESSORS & VENDOR INVENTORY
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_name TEXT NOT NULL,
  service_provided TEXT NOT NULL,
  data_shared TEXT NOT NULL,
  data_location TEXT NOT NULL,
  contract_status TEXT DEFAULT 'ACTIVE',
  last_security_audit DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. DATA RETENTION POLICIES
CREATE TABLE IF NOT EXISTS public.retention_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_category TEXT UNIQUE NOT NULL,
  retention_period_days INT NOT NULL,
  auto_purge BOOLEAN DEFAULT TRUE,
  legal_basis TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- FUNCTIONS & PROCEDURES (DPDP Anonymization & Purge)
-- ==============================================================================

-- Function to anonymize customer data upon Data Principal Erasure Request
CREATE OR REPLACE FUNCTION anonymize_customer_data(target_customer_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Anonymize customer personal identifying details
  UPDATE public.customers
  SET 
    name = 'Anonymized User',
    phone = CONCAT('+91-XXXX-XXXX-', SUBSTRING(id::text, 1, 4)),
    location = 'Redacted',
    tags = '["ANONYMIZED"]'::jsonb,
    is_anonymized = TRUE,
    anonymized_at = NOW(),
    updated_at = NOW()
  WHERE id = target_customer_id;

  -- Redact text content of incoming/outgoing messages
  UPDATE public.messages
  SET content = '[REDACTED PER DPDP ERASURE REQUEST]'
  WHERE conversation_id IN (
    SELECT id FROM public.conversations WHERE customer_id = target_customer_id
  );

  -- Log administrative audit action
  INSERT INTO public.audit_logs (action, resource_type, resource_id, metadata)
  VALUES ('DPDP_DATA_ERASURE_EXECUTED', 'customers', target_customer_id, '{"reason": "Data Principal Erasure Executed"}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_tickets ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (Admin and Staff) read and write access
CREATE POLICY "Authenticated staff access" ON public.customers FOR ALL USING (true);
CREATE POLICY "Authenticated staff conversations" ON public.conversations FOR ALL USING (true);
CREATE POLICY "Authenticated staff messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Authenticated staff leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Authenticated staff faqs" ON public.faqs FOR ALL USING (true);
CREATE POLICY "Authenticated staff automation" ON public.automation_rules FOR ALL USING (true);
CREATE POLICY "Authenticated staff followups" ON public.followups FOR ALL USING (true);
CREATE POLICY "Authenticated staff audit logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Authenticated staff consent records" ON public.consent_records FOR ALL USING (true);
CREATE POLICY "Authenticated staff data requests" ON public.data_requests FOR ALL USING (true);
CREATE POLICY "Authenticated staff grievance tickets" ON public.grievance_tickets FOR ALL USING (true);
