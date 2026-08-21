import { z } from 'zod';

// Zod validation schemas for all server-side API endpoints

export const AIRouterInputSchema = z.object({
  customer_id: z.string().uuid().optional(),
  conversation_id: z.string().uuid().optional(),
  message_id: z.string().optional(),
  user_message: z
    .string()
    .min(1, 'User message cannot be empty')
    .max(2000, 'User message exceeds maximum allowed length of 2000 characters')
    .trim(),
  intent: z.string().max(100).optional(),
  language: z.string().max(20).optional(),
  knowledge_context: z.array(z.any()).optional(),
  conversation_context: z.array(z.any()).optional(),
  requires_ai: z.boolean().optional(),
});

export const DPDPAcceptSchema = z.object({
  customer_id: z.string().min(1, 'customer_id is required'),
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
});

export const ProductInputSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  specifications: z.record(z.string(), z.string()).optional(),
  active: z.boolean().default(true),
});

export const SettingsUpdateSchema = z.object({
  phone_number_id: z.string().min(1).max(50).optional(),
  waba_id: z.string().min(1).max(50).optional(),
  auto_reply_enabled: z.boolean().optional(),
  business_hours: z.string().max(100).optional(),
});
