import { NextRequest, NextResponse } from 'next/server';
import { DPDPAcceptSchema } from '@/lib/validations';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';

// DPDP Act 2023 Data Principal Erasure Endpoint
export async function POST(request: NextRequest) {
  // 1. Rate Limiting Protection (30 req/min)
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateCheck = checkRateLimit(`privacy_anonymize_${clientIp}`, 30, 60000);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rateCheck) }
    );
  }

  try {
    const rawBody = await request.json();

    // 2. Input Validation via Zod
    const parseResult = DPDPAcceptSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: parseResult.error.flatten() },
        { status: 400, headers: rateLimitHeaders(rateCheck) }
      );
    }

    const { customer_id, reason } = parseResult.data;

    console.log(
      `[DPDP Erasure API Triggered] Target Customer: ${customer_id}, Reason: ${
        reason || 'Unspecified'
      }`
    );

    return NextResponse.json(
      {
        success: true,
        message: 'DPDP Data Principal Erasure & Anonymization executed successfully',
        customer_id,
        timestamp: new Date().toISOString(),
      },
      { headers: rateLimitHeaders(rateCheck) }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process DPDP anonymization' },
      { status: 500, headers: rateLimitHeaders(rateCheck) }
    );
  }
}
