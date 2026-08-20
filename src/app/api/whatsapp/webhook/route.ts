import { NextRequest, NextResponse } from 'next/server';

// Meta WhatsApp Webhook Verification (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.META_WHATSAPP_VERIFY_TOKEN || 'kedar_whatsapp_verify_token_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('META WHATSAPP WEBHOOK VERIFIED SUCCESSFULLY!');
      return new NextResponse(challenge, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 });
    }
  }

  return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
}

// Incoming WhatsApp Event Dispatcher (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify incoming payload structure
    if (body.entry && body.entry[0]?.changes?.[0]?.value?.messages) {
      const messageData = body.entry[0].changes[0].value.messages[0];
      const fromPhone = messageData.from;
      const textBody = messageData.text?.body || '';

      console.log(`[Meta Webhook Received] From: ${fromPhone}, Text: ${textBody}`);

      // Optional: Forward payload to n8n webhook orchestration engine
      const n8nWebhookUrl = process.env.N8N_WHATSAPP_WEBHOOK_URL;
      if (n8nWebhookUrl) {
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).catch((err) => console.error('n8n dispatch error:', err));
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ status: 'NO_MESSAGE_PAYLOAD' }, { status: 200 });
  } catch (error) {
    console.error('Meta webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
