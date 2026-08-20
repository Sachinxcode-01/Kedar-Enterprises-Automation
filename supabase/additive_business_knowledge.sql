-- ==============================================================================
-- KEDAR ENTERPRISES — SAFE ADDITIVE MIGRATION: KNOWLEDGE & AI OBSERVABILITY
-- File: supabase/migrations/20260820150000_additive_business_knowledge.sql
-- ==============================================================================

-- 1. BUSINESS INFORMATION TABLE (Verified Company Settings Store)
CREATE TABLE IF NOT EXISTS public.business_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT,
  legal_name TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,
  business_hours JSONB DEFAULT '{}'::jsonb,
  gstin TEXT,
  support_contact TEXT,
  privacy_policy TEXT,
  terms_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  unit TEXT DEFAULT 'piece',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- 3. SERVICES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  scope TEXT,
  sla TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- 4. PRICES TABLE (Authoritative Historical Pricing Engine)
CREATE TABLE IF NOT EXISTS public.prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NULL REFERENCES public.products(id) ON DELETE CASCADE,
  service_id UUID NULL REFERENCES public.services(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  unit TEXT,
  pricing_type TEXT DEFAULT 'STANDARD' CHECK (pricing_type IN ('STANDARD', 'TIERED', 'SUBSCRIPTION', 'CUSTOM')),
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  effective_until TIMESTAMPTZ NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_price_target CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_prices_product_id ON public.prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_service_id ON public.prices(service_id);
CREATE INDEX IF NOT EXISTS idx_prices_effective_dates ON public.prices(effective_from, effective_until);
CREATE INDEX IF NOT EXISTS idx_prices_active ON public.prices(active);

-- 5. AI INTERACTIONS TABLE (Privacy-Minimized LLM Observability & Audit Trace)
CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NULL REFERENCES public.conversations(id) ON DELETE SET NULL,
  message_id UUID NULL REFERENCES public.messages(id) ON DELETE SET NULL,
  provider TEXT NOT NULL, -- Groq, Gemini, OpenRouter, OpenAI
  model TEXT NOT NULL,
  intent TEXT,
  confidence NUMERIC(5,4),
  latency_ms INT,
  input_token_count INT DEFAULT 0,
  output_token_count INT DEFAULT 0,
  status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED', 'FALLBACK', 'FLAGGED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_conversation ON public.ai_interactions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_message ON public.ai_interactions(message_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_provider_model ON public.ai_interactions(provider, model);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON public.ai_interactions(created_at);

-- ATTACH UPDATED_AT TRIGGERS TO ADDITIVE TABLES
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_business_information_updated_at') THEN
    CREATE TRIGGER trg_business_information_updated_at BEFORE UPDATE ON public.business_information FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_products_updated_at') THEN
    CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_services_updated_at') THEN
    CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_prices_updated_at') THEN
    CREATE TRIGGER trg_prices_updated_at BEFORE UPDATE ON public.prices FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
  END IF;
END $$;

-- ROW LEVEL SECURITY (RLS) POLICIES FOR ADDITIVE TABLES
ALTER TABLE public.business_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Business Information Policies
  DROP POLICY IF EXISTS "Staff read business_information" ON public.business_information;
  CREATE POLICY "Staff read business_information" ON public.business_information FOR SELECT USING (public.is_staff_or_admin());

  DROP POLICY IF EXISTS "Admin manage business_information" ON public.business_information;
  CREATE POLICY "Admin manage business_information" ON public.business_information FOR ALL USING (public.is_admin());

  -- Products Policies
  DROP POLICY IF EXISTS "Staff read products" ON public.products;
  CREATE POLICY "Staff read products" ON public.products FOR SELECT USING (public.is_staff_or_admin());

  DROP POLICY IF EXISTS "Staff manage products" ON public.products;
  CREATE POLICY "Staff manage products" ON public.products FOR ALL USING (public.is_staff_or_admin());

  -- Services Policies
  DROP POLICY IF EXISTS "Staff read services" ON public.services;
  CREATE POLICY "Staff read services" ON public.services FOR SELECT USING (public.is_staff_or_admin());

  DROP POLICY IF EXISTS "Staff manage services" ON public.services;
  CREATE POLICY "Staff manage services" ON public.services FOR ALL USING (public.is_staff_or_admin());

  -- Prices Policies
  DROP POLICY IF EXISTS "Staff read prices" ON public.prices;
  CREATE POLICY "Staff read prices" ON public.prices FOR SELECT USING (public.is_staff_or_admin());

  DROP POLICY IF EXISTS "Staff manage prices" ON public.prices;
  CREATE POLICY "Staff manage prices" ON public.prices FOR ALL USING (public.is_staff_or_admin());

  -- AI Interactions Policies
  DROP POLICY IF EXISTS "Staff view ai_interactions" ON public.ai_interactions;
  CREATE POLICY "Staff view ai_interactions" ON public.ai_interactions FOR SELECT USING (public.is_staff_or_admin());

  DROP POLICY IF EXISTS "Admin manage ai_interactions" ON public.ai_interactions;
  CREATE POLICY "Admin manage ai_interactions" ON public.ai_interactions FOR ALL USING (public.is_admin());
END $$;
