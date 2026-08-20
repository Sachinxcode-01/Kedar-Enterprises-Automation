export type UserRole = 'ADMIN' | 'STAFF';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  tags: string[];
  is_anonymized: boolean;
  anonymized_at?: string;
  created_at: string;
}

export type ConversationMode = 'BOT' | 'HUMAN';
export type ConversationStatus = 'OPEN' | 'RESOLVED' | 'PENDING';

export interface Conversation {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_location: string;
  tags: string[];
  status: ConversationStatus;
  mode: ConversationMode;
  assigned_to?: string;
  assigned_name?: string;
  unread_count: number;
  last_message: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  message_type: 'text' | 'template' | 'image' | 'interactive';
  content: string;
  sender_type: 'CUSTOMER' | 'BOT' | 'STAFF';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  created_at: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'FOLLOW_UP' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  requirement: string;
  product: string;
  status: LeadStatus;
  assigned_to?: string;
  assigned_name?: string;
  notes: string;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  enabled: boolean;
  match_count: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger_event: string;
  enabled: boolean;
  success_count: number;
  failure_count: number;
}

export interface ConsentRecord {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  purpose: string;
  status: 'GRANTED' | 'WITHDRAWN' | 'EXPIRED';
  notice_version: string;
  source: string;
  granted_at: string;
}

export interface DataRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  request_type: 'ACCESS' | 'CORRECTION' | 'ERASURE' | 'WITHDRAWAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  details: string;
  resolution_notes?: string;
  requested_at: string;
}

export interface GrievanceTicket {
  id: string;
  ticket_number: string;
  customer_name: string;
  issue: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  created_at: string;
  resolution?: string;
}

export interface AuditLog {
  id: string;
  user_name: string;
  action: string;
  resource_type: string;
  metadata: string;
  ip_address: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  vendor_name: string;
  service_provided: string;
  data_shared: string;
  data_location: string;
  contract_status: string;
  last_security_audit: string;
}

export interface RetentionPolicy {
  id: string;
  data_category: string;
  retention_period_days: number;
  auto_purge: boolean;
  legal_basis: string;
}
