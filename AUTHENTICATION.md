# Kedar Enterprises — Production Authentication & Security System

This document outlines the production authentication, authorization, session security, and account protection architecture for the **Kedar Enterprises WhatsApp Automation Platform**.

---

## 1. Authentication Architecture

```
User Browser
   ↓
Next.js Application (/login)
   ├─► Continue with Google (OAuth 2.0 via Supabase Auth)
   └─► Email & Password (Bcrypt/Argon2 encrypted via Supabase Auth)
   ↓
Supabase Auth Service
   ↓
OAuth / Auth Code Exchange (/auth/callback)
   ↓
Secure HttpOnly Session Cookies (@supabase/ssr)
   ↓
Database Profile Resolution (public.profiles)
   ↓
Edge Middleware Role & Active Status Guard (ADMIN vs STAFF)
   ↓
Authorized Dashboard Access or /unauthorized redirection
```

---

## 2. First Admin Bootstrap Procedure

To establish the initial `ADMIN` user safely without exposing registration endpoints or allowing client-side privilege escalation:

### Step 1: Register the Account
1. Visit the `/login` portal.
2. Sign in with Google or create an account with work email (`admin@kedarenterprises.com`).
3. By default, the account is provisioned as `STAFF` with `active: true`.

### Step 2: Elevate to ADMIN via SQL (One-Time Bootstrap)
Execute the following query directly in the **Supabase Dashboard SQL Editor**:

```sql
-- Bootstrap First Administrator Account
UPDATE public.profiles
SET role = 'ADMIN',
    active = TRUE,
    updated_at = NOW()
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@kedarenterprises.com' LIMIT 1
);
```

### Step 3: Subsequent Staff & Admin Management
Once the first `ADMIN` is assigned, all future staff activations, deactivations, and role adjustments can be safely performed via the **User Management Desk** at `/users`.

---

## 3. Role-Based Permissions Matrix (RBAC)

| Feature / Route | ADMIN | STAFF | Inactive User | Anonymous |
| :--- | :---: | :---: | :---: | :---: |
| **Overview Dashboard (`/`)** | ✅ Allowed | ✅ Allowed | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **WhatsApp Inbox (`/inbox`)** | ✅ Allowed | ✅ Allowed | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Customer Directory (`/customers`)** | ✅ Allowed | ✅ Allowed | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Leads Pipeline (`/leads`)** | ✅ Allowed | ✅ Allowed | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Human Escalations (`/handoff`)** | ✅ Allowed | ✅ Allowed | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Notifications Desk (`/notifications`)** | ✅ Allowed | ✅ Allowed | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Account Security (`/security`)** | ✅ Allowed | ✅ Allowed | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **AI Automation Center (`/automation`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Knowledge Base (`/knowledge`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Analytics & Telemetry (`/analytics`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **DPDP Compliance (`/privacy`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **User & Staff Management (`/users`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Tamper-Evident Audit Logs (`/audit-logs`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Error Diagnosis & Health (`/errors`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |
| **Platform Settings & Webhooks (`/settings`)** | ✅ Allowed | ❌ 403 Blocked | ❌ 403 Forbidden | ❌ Redirect `/login` |

---

## 4. Abuse Prevention & Brute-Force Rate Limiting

- **Sliding-Window Token Bucket**: Protects `/api/ai/router` (60 req/min) and `/api/privacy/anonymize` (30 req/min).
- **Brute-Force Penalty**:
  - $\ge 5$ consecutive failed login attempts $\rightarrow$ **30-second progressive delay**.
  - $\ge 10$ consecutive failed login attempts $\rightarrow$ **15-minute temporary lockout**.
- **Generic Error Responses**: Failed logins return *"Invalid email or password"* regardless of whether the account exists, preventing account enumeration.

---

## 5. Security Headers & CSP

Configured in `next.config.mjs`:
- **Content-Security-Policy**: Enforces strict origin whitelist for Google Auth, Supabase, and AI providers.
- **HSTS**: `max-age=63072000; includeSubDomains; preload`
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=()`

---

## 6. Audit Trail Integration

The system records immutable audit logs to `public.audit_logs` for all critical security events:
- `LOGIN_SUCCESS`
- `LOGIN_FAILURE`
- `GOOGLE_LOGIN`
- `LOGOUT`
- `PASSWORD_RESET_REQUEST`
- `PASSWORD_RESET_SUCCESS`
- `ACCOUNT_DEACTIVATED`
- `ACCOUNT_ACTIVATED`
- `ROLE_CHANGED`
- `UNAUTHORIZED_ACCESS`
- `RATE_LIMIT_TRIGGERED`
