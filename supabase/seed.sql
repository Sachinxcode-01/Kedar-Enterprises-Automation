-- ==============================================================================
-- KEDAR ENTERPRISES — SEED DATA FOR DEMO & PRODUCTION INITIALIZATION
-- ==============================================================================

-- 1. USERS (Admin & Staff)
INSERT INTO public.users (id, email, name, role, active) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'admin@kedarenterprises.com', 'Kedar Administrator', 'ADMIN', true),
  ('a2222222-2222-2222-2222-222222222222', 'staff.rahul@kedarenterprises.com', 'Rahul Sharma', 'STAFF', true),
  ('a3333333-3333-3333-3333-333333333333', 'staff.priya@kedarenterprises.com', 'Priya Patel', 'STAFF', true)
ON CONFLICT (id) DO NOTHING;

-- 2. CUSTOMERS
INSERT INTO public.customers (id, name, phone, location, tags, is_anonymized) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Amit Verma', '+919876543210', 'Mumbai, MH', '["VIP", "Commercial"]'::jsonb, false),
  ('c2222222-2222-2222-2222-222222222222', 'Sunita Rao', '+919812345678', 'Bengaluru, KA', '["Residential", "Urgent"]'::jsonb, false),
  ('c3333333-3333-3333-3333-333333333333', 'Rajesh Gupta', '+919711223344', 'Delhi NCR', '["Industrial"]'::jsonb, false),
  ('c4444444-4444-4444-4444-444444444444', 'Ananya Deshmukh', '+919655443322', 'Pune, MH', '["General Enquiry"]'::jsonb, false),
  ('c5555555-5555-5555-5555-555555555555', 'Anonymized User', '+91-XXXX-XXXX-c555', 'Redacted', '["ANONYMIZED"]'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- 3. CONVERSATIONS
INSERT INTO public.conversations (id, customer_id, status, mode, assigned_to, unread_count, last_message_at) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'OPEN', 'HUMAN', 'a2222222-2222-2222-2222-222222222222', 2, NOW() - INTERVAL '5 minutes'),
  ('b2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'OPEN', 'BOT', NULL, 0, NOW() - INTERVAL '30 minutes'),
  ('b3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'RESOLVED', 'BOT', NULL, 0, NOW() - INTERVAL '2 days'),
  ('b4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'OPEN', 'BOT', NULL, 1, NOW() - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;

-- 4. MESSAGES
INSERT INTO public.messages (id, conversation_id, direction, message_type, content, sender_type, status, created_at) VALUES
  ('m101', 'b1111111-1111-1111-1111-111111111111', 'INBOUND', 'text', 'Hello, I need pricing details for commercial HVAC installations for our 5-floor building in Mumbai.', 'CUSTOMER', 'READ', NOW() - INTERVAL '20 minutes'),
  ('m102', 'b1111111-1111-1111-1111-111111111111', 'OUTBOUND', 'text', '👋 Welcome to Kedar Enterprises! Let me connect you with our Commercial Equipment specialist.', 'BOT', 'DELIVERED', NOW() - INTERVAL '19 minutes'),
  ('m103', 'b1111111-1111-1111-1111-111111111111', 'INBOUND', 'text', 'Can I talk to a human expert right now?', 'CUSTOMER', 'READ', NOW() - INTERVAL '10 minutes'),
  ('m104', 'b1111111-1111-1111-1111-111111111111', 'OUTBOUND', 'text', 'Hi Amit! I am Rahul Sharma from Kedar Enterprises. I have taken over this chat. Let me share our commercial product catalog.', 'STAFF', 'DELIVERED', NOW() - INTERVAL '5 minutes'),
  
  ('m201', 'b2222222-2222-2222-2222-222222222222', 'INBOUND', 'text', 'What are your working hours and office location in Bengaluru?', 'CUSTOMER', 'READ', NOW() - INTERVAL '30 minutes'),
  ('m202', 'b2222222-2222-2222-2222-222222222222', 'OUTBOUND', 'text', '🏢 Kedar Enterprises Working Hours:\nMonday–Saturday: 09:00 AM – 06:00 PM IST.\n\n📍 Office Location: MG Road, Bengaluru, Karnataka.', 'BOT', 'DELIVERED', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 5. LEADS
INSERT INTO public.leads (id, customer_id, requirement, product, status, assigned_to, notes) VALUES
  ('l1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '5-floor commercial HVAC installation & maintenance setup', 'Commercial HVAC Solutions', 'QUALIFIED', 'a2222222-2222-2222-2222-222222222222', 'Requested custom quotation for Mumbai site inspection.'),
  ('l2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Residential solar inverter unit', 'Solar Power Units', 'NEW', NULL, 'Inquired via WhatsApp automation keyword menu.'),
  ('l3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'Industrial generator annual service contract', 'Industrial Generators', 'CONVERTED', 'a3333333-3333-3333-3333-333333333333', 'Contract signed & payment confirmed.')
ON CONFLICT (id) DO NOTHING;

-- 6. FAQS
INSERT INTO public.faqs (id, question, answer, keywords, category, enabled, match_count) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'What are your working hours?', 'Our business hours are Monday through Saturday, 9:00 AM to 6:00 PM IST. We remain closed on Sundays and National Holidays.', '["hours", "timing", "open", "working hours", "time"]'::jsonb, 'General Info', true, 48),
  ('f2222222-2222-2222-2222-222222222222', 'Where is your main office located?', 'Kedar Enterprises head office is located at plot 45, Industrial Suburb Stage II, Bengaluru, Karnataka - 560022.', '["address", "location", "office", "where", "map"]'::jsonb, 'General Info', true, 32),
  ('f3333333-3333-3333-3333-333333333333', 'How can I request a price quotation?', 'You can type "Enquiry" or select option 3 in our WhatsApp main menu. A sales consultant will contact you within 2 business hours.', '["price", "quote", "cost", "rates", "catalog", "enquiry"]'::jsonb, 'Sales', true, 76),
  ('f4444444-4444-4444-4444-444444444444', 'What is your warranty policy?', 'All equipment supplied by Kedar Enterprises comes with a 12-month standard manufacturer warranty and 2 complimentary service visits.', '["warranty", "guarantee", "service", "repair"]'::jsonb, 'Support', true, 19)
ON CONFLICT (id) DO NOTHING;

-- 7. AUTOMATION RULES
INSERT INTO public.automation_rules (id, name, description, trigger_event, enabled, success_count, failure_count) VALUES
  ('r1111111-1111-1111-1111-111111111111', 'Welcome Menu Greeting', 'Sends standard welcoming message with 5 options on initial customer contact', 'FIRST_MESSAGE', true, 342, 0),
  ('r2222222-2222-2222-2222-222222222222', 'Deterministic FAQ Matcher', 'Retrieves relevant FAQ answer based on exact keyword search in Supabase DB', 'KEYWORD_MATCH', true, 512, 2),
  ('r3333333-3333-3333-3333-333333333333', 'Lead Qualification Capture', 'Captures name, requirement, and location through conversational state flow', 'MENU_OPTION_3', true, 128, 1),
  ('r4444444-4444-4444-4444-444444444444', 'Human Takeover Router', 'Changes mode to HUMAN and alerts available staff dashboard upon human request', 'HUMAN_REQUEST', true, 44, 0),
  ('r5555555-5555-5555-5555-555555555555', '24-Hour Follow-Up Cron', 'Sends approved Meta WhatsApp template to pending leads after 24 hours', 'SCHEDULED_CRON', true, 89, 0)
ON CONFLICT (id) DO NOTHING;

-- 8. CONSENT RECORDS (DPDP Act 2023)
INSERT INTO public.consent_records (id, customer_id, purpose, status, notice_version, source, granted_at) VALUES
  ('cs111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'WhatsApp Business Service Communication & Lead Qualification', 'GRANTED', 'v1.0-2024', 'WHATSAPP_OPTIN', NOW() - INTERVAL '10 days'),
  ('cs222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'WhatsApp Business Service Communication', 'GRANTED', 'v1.0-2024', 'WHATSAPP_OPTIN', NOW() - INTERVAL '5 days'),
  ('cs333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'WhatsApp Communication & Direct Followup', 'GRANTED', 'v1.0-2024', 'WHATSAPP_OPTIN', NOW() - INTERVAL '15 days'),
  ('cs444444-4444-4444-4444-444444444444', 'c5555555-5555-5555-5555-555555555555', 'WhatsApp Business Communication', 'WITHDRAWN', 'v1.0-2024', 'ERASURE_REQUEST', NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- 9. DATA PRINCIPAL REQUESTS (DPDP Act 2023)
INSERT INTO public.data_requests (id, customer_id, request_type, status, details, resolution_notes, requested_at, completed_at, processed_by) VALUES
  ('dr111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555', 'ERASURE', 'COMPLETED', 'Customer requested full deletion of personal phone and chat history under DPDP Act 2023 Sec. 12.', 'Executed anonymize_customer_data SQL function. Phone redacted to +91-XXXX-XXXX-c555.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 'a1111111-1111-1111-1111-111111111111'),
  ('dr222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'ACCESS', 'IN_PROGRESS', 'Requested export summary of stored personal data & lead details.', 'Export JSON generated, awaiting staff review.', NOW() - INTERVAL '1 day', NULL, 'a2222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- 10. GRIEVANCE TICKETS (DPDP Compliance Officer Workflow)
INSERT INTO public.grievance_tickets (id, ticket_number, customer_id, issue, category, status, assigned_officer, resolution) VALUES
  ('gt111111-1111-1111-1111-111111111111', 'KE-DPDP-2026-001', 'c4444444-4444-4444-4444-444444444444', 'Inquired how customer WhatsApp phone number was sourced for business message.', 'Privacy/Consent', 'OPEN', 'a1111111-1111-1111-1111-111111111111', NULL),
  ('gt222222-2222-2222-2222-222222222222', 'KE-DPDP-2026-002', 'c5555555-5555-5555-5555-555555555555', 'Requested confirmation of data anonymization.', 'Data Erasure', 'RESOLVED', 'a1111111-1111-1111-1111-111111111111', 'Confirmation letter sent via email; database record successfully anonymized.')
ON CONFLICT (id) DO NOTHING;

-- 11. VENDORS & DATA PROCESSOR INVENTORY
INSERT INTO public.vendors (id, vendor_name, service_provided, data_shared, data_location, contract_status, last_security_audit) VALUES
  ('v1111111-1111-1111-1111-111111111111', 'Meta Platforms Ireland / India', 'WhatsApp Cloud API Transport', 'WhatsApp Phone Number, Encrypted Payload', 'Meta Cloud (EU / Global Nodes)', 'ACTIVE', '2026-01-15'),
  ('v2222222-2222-2222-2222-222222222222', 'Supabase Inc.', 'PostgreSQL Managed Database & Auth', 'Customer Data, Messages, Logs', 'AWS Mumbai (ap-south-1)', 'ACTIVE', '2026-02-10'),
  ('v3333333-3333-3333-3333-333333333333', 'n8n Cloud / Self-Hosted VPS', 'Workflow Automation Engine', 'Event Webhook Payloads (Ephemeral)', 'Secured Cloud VPS', 'ACTIVE', '2026-03-01'),
  ('v4444444-4444-4444-4444-444444444444', 'Vercel Inc.', 'Dashboard Web Application Hosting', 'No Direct DB Data (Client Side Only)', 'Vercel Global Edge Network', 'ACTIVE', '2026-01-20')
ON CONFLICT (id) DO NOTHING;

-- 12. RETENTION POLICIES
INSERT INTO public.retention_policies (id, data_category, retention_period_days, auto_purge, legal_basis) VALUES
  ('rp111111-1111-1111-1111-111111111111', 'Customer Messages & Chat Logs', 180, true, 'DPDP Act 2023 Sec 8(7) Purpose Limitation'),
  ('rp222222-2222-2222-2222-222222222222', 'Qualified Lead Records', 365, false, 'Commercial Contractual Necessity'),
  ('rp333333-3333-3333-3333-333333333333', 'Consent Ledger Records', 1095, false, 'Statutory Compliance Record Keeping'),
  ('rp444444-4444-4444-4444-444444444444', 'System Security Audit Logs', 730, true, 'Information Technology Act & Security Compliance')
ON CONFLICT (id) DO NOTHING;

-- 13. AUDIT LOGS
INSERT INTO public.audit_logs (id, user_id, action, resource_type, resource_id, metadata, ip_address) VALUES
  ('a901', 'a1111111-1111-1111-1111-111111111111', 'ADMIN_LOGIN', 'users', 'a1111111-1111-1111-1111-111111111111', '{"method": "password_auth"}'::jsonb, '103.21.124.5'),
  ('a902', 'a2222222-2222-2222-2222-222222222222', 'HUMAN_TAKEOVER_INITIATED', 'conversations', 'b1111111-1111-1111-1111-111111111111', '{"previous_mode": "BOT"}'::jsonb, '103.21.124.88'),
  ('a903', 'a1111111-1111-1111-1111-111111111111', 'DPDP_ERASURE_APPROVED', 'data_requests', 'dr111111-1111-1111-1111-111111111111', '{"customer_phone": "+91-XXXX-XXXX-c555"}'::jsonb, '103.21.124.5'),
  ('a904', 'a1111111-1111-1111-1111-111111111111', 'FAQ_UPDATED', 'faqs', 'f1111111-1111-1111-1111-111111111111', '{"updated_field": "answer"}'::jsonb, '103.21.124.5')
ON CONFLICT (id) DO NOTHING;
