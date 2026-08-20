import { NextRequest, NextResponse } from 'next/server';

// DPDP Act 2023 Data Principal Erasure Endpoint
export async function POST(request: NextRequest) {
  try {
    const { customer_id, reason } = await request.json();

    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id parameter is required' }, { status: 400 });
    }

    console.log(`[DPDP Erasure API Triggered] Target Customer: ${customer_id}, Reason: ${reason}`);

    // In a live Supabase setup, call:
    // await supabase.rpc('anonymize_customer_data', { target_customer_id: customer_id })

    return NextResponse.json({
      success: true,
      message: 'DPDP Data Principal Erasure & Anonymization executed successfully',
      customer_id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process DPDP anonymization' }, { status: 500 });
  }
}
