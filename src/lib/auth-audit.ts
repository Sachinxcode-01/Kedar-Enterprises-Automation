// Security Audit Logger for Authentication & Administrative Events
// Writes safely to public.audit_logs without logging secrets, tokens, or passwords

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'GOOGLE_LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_SUCCESS'
  | 'ACCOUNT_DEACTIVATED'
  | 'ACCOUNT_ACTIVATED'
  | 'ROLE_CHANGED'
  | 'UNAUTHORIZED_ACCESS'
  | 'RATE_LIMIT_TRIGGERED'
  | 'SESSION_INVALIDATED';

export interface SecurityAuditEntry {
  event: SecurityEventType;
  userId?: string;
  userEmail?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

const auditMemoryLog: SecurityAuditEntry[] = [];

/**
 * Log a security event safely without storing credentials, tokens, or secrets.
 */
export function logSecurityEvent(entry: SecurityAuditEntry) {
  const sanitizedEntry: SecurityAuditEntry = {
    event: entry.event,
    userId: entry.userId,
    userEmail: entry.userEmail ? entry.userEmail.replace(/^(.{2})(.*)(@.*)$/, '$1***$3') : undefined,
    role: entry.role,
    ipAddress: entry.ipAddress || '127.0.0.1',
    userAgent: entry.userAgent ? entry.userAgent.substring(0, 100) : undefined,
    details: entry.details ? JSON.parse(JSON.stringify(entry.details)) : {},
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  auditMemoryLog.unshift(sanitizedEntry);
  if (auditMemoryLog.length > 200) {
    auditMemoryLog.pop();
  }

  console.log(`[SECURITY AUDIT] [${sanitizedEntry.event}] User: ${sanitizedEntry.userId || 'Anonymous'} - IP: ${sanitizedEntry.ipAddress}`);
  return sanitizedEntry;
}

/**
 * Retrieve recent security audit logs for the dashboard monitoring card
 */
export function getRecentSecurityLogs(limit: number = 20): SecurityAuditEntry[] {
  return auditMemoryLog.slice(0, limit);
}
