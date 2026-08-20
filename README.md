# Kedar Enterprises — WhatsApp Automation & DPDP Act 2023 Compliance Platform

Production-ready WhatsApp Automation platform built for **Kedar Enterprises** featuring a 3-Panel Inbox dashboard, Meta WhatsApp Cloud API webhooks, Supabase backend with Row Level Security (RLS), n8n workflow blueprints, and comprehensive **Digital Personal Data Protection (DPDP) Act, 2023** privacy controls.

---

## 🚀 Key Features

1. **3-Panel Professional WhatsApp Inbox (`/inbox`)**
   - Panel 1: Filterable conversation search, status filters (Open/Resolved, Bot/Human mode, Assigned Staff).
   - Panel 2: Message history, live response editor, instant Human Takeover (`BOT` ↔ `HUMAN`), chat resolution.
   - Panel 3: Customer profile, lead details, tags, DPDP consent badge.

2. **DPDP Act 2023 Privacy & Data Hub (`/privacy`)**
   - **Consent Ledger**: Comprehensive audit log of granted and withdrawn WhatsApp consents.
   - **Data Principal Requests**: Tracker for Data Access, Correction, and Right-to-Erasure (Anonymization).
   - **Grievance Redressal Officer Workflow**: Ticket management system for privacy inquiries.
   - **Vendor/Processor Inventory**: Audit tracking for Meta, Supabase, n8n, and Vercel.
   - **Configurable Retention Purge Rules**: Automatic message payload purging (e.g. 180 days).

3. **n8n Workflow Automation Blueprints (`n8n/workflows/`)**
   - `01_incoming_whatsapp_webhook.json`: Meta webhook parser & conversation state engine.
   - `02_intent_router_faq.json`: Deterministic keyword FAQ matcher.
   - `03_lead_capture_state_machine.json`: Qualification collector.
   - `04_human_handoff_and_notification.json`: Handoff alert trigger.
   - `05_automated_followups_cron.json`: Scheduled 24h/72h template follow-up engine.
   - `06_dpdp_retention_and_anonymization.json`: Compliant data purging cron.

4. **Database & Security Architecture (`supabase/`)**
   - `schema.sql`: PostgreSQL schema with RLS, audit logs, and `anonymize_customer_data` SQL procedure.
   - `seed.sql`: Realistic seed data with commercial HVAC inquiries, leads, FAQs, consent records, and audit logs.

---

## 🛠️ Quick Start

```bash
# 1. Navigate to directory
cd C:\Users\kalin\.gemini\antigravity-ide\scratch\kedar-whatsapp-platform

# 2. Install dependencies
npm install

# 3. Launch Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚖️ Legal Disclaimer

Software alone cannot guarantee 100% DPDP Act compliance. Kedar Enterprises must conduct independent legal review for organizational notices, retention schedules, vendor contracts, and grievance procedures.
