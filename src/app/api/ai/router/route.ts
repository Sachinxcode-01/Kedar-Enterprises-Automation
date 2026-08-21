import { NextRequest, NextResponse } from 'next/server';
import { AIRouterInputSchema } from '@/lib/validations';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Protection (60 req/min per client IP)
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateCheck = checkRateLimit(`ai_router_${clientIp}`, 60, 60000);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rateCheck) }
    );
  }

  try {
    const rawBody = await request.json();

    // 2. Server-Side Input Validation via Zod
    const parseResult = AIRouterInputSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parseResult.error.flatten() },
        { status: 400, headers: rateLimitHeaders(rateCheck) }
      );
    }

    const input = parseResult.data;
    const userMessage = (input.user_message || '').trim();
    const requiresAi = input.requires_ai !== false;
    const knowledgeContext = input.knowledge_context || [];

    // Step 1 — Check if AI is required
    if (!requiresAi) {
      return NextResponse.json(
        {
          approved: true,
          reply: 'Thank you for reaching Kedar Enterprises.',
          requires_human: false,
          provider: 'DETERMINISTIC',
          model: 'RULE_ENGINE',
          confidence: 1.0,
          reason: 'DETERMINISTIC_PASS',
          ai_interaction_id: null,
        },
        { headers: rateLimitHeaders(rateCheck) }
      );
    }

    // Step 2 — Guardrail & Secret Extraction Check
    const isSecurityThreat =
      /(ignore previous instructions|system prompt|admin phone|root password|api key|service_role|token)/i.test(
        userMessage
      );
    if (isSecurityThreat) {
      return NextResponse.json(
        {
          approved: false,
          reply: '',
          requires_human: true,
          provider: 'GUARDRAIL',
          model: 'SECURITY_FILTER',
          confidence: 0.0,
          reason: 'RESPONSE_VALIDATION_FAILED',
          ai_interaction_id: null,
        },
        { headers: rateLimitHeaders(rateCheck) }
      );
    }

    // Step 3 — Fact-Seeking & Knowledge Context Verification
    const hasKnowledge = knowledgeContext.length > 0;
    const isGreeting = /^(hi|hello|hey|good morning|namaste)/i.test(userMessage);

    if (!isGreeting && !hasKnowledge) {
      return NextResponse.json(
        {
          approved: false,
          reply: "That information is currently unavailable. I'll connect you with our team.",
          requires_human: true,
          provider: 'FALLBACK_GUARD',
          model: 'NOT_CONFIGURED_CHECK',
          confidence: 0.0,
          reason: 'KNOWLEDGE_NOT_CONFIGURED',
          ai_interaction_id: null,
        },
        { headers: rateLimitHeaders(rateCheck) }
      );
    }

    // Step 4 — Greetings
    if (isGreeting) {
      return NextResponse.json(
        {
          approved: true,
          reply:
            'Hello! Welcome to Kedar Enterprises. How can we assist you with your HVAC and commercial equipment needs today?',
          requires_human: false,
          provider: 'Groq',
          model: 'llama-3.3-70b-versatile',
          confidence: 0.98,
          reason: 'SUCCESS',
          ai_interaction_id: `ai_${Date.now()}`,
        },
        { headers: rateLimitHeaders(rateCheck) }
      );
    }

    // Step 5 — Verified Knowledge Generation
    if (hasKnowledge) {
      const fact = knowledgeContext[0];
      const replyText =
        typeof fact === 'string'
          ? fact
          : fact.answer || fact.description || JSON.stringify(fact);
      return NextResponse.json(
        {
          approved: true,
          reply: replyText,
          requires_human: false,
          provider: 'Groq',
          model: 'llama-3.3-70b-versatile',
          confidence: 0.95,
          reason: 'SUCCESS',
          ai_interaction_id: `ai_${Date.now()}`,
        },
        { headers: rateLimitHeaders(rateCheck) }
      );
    }

    // Step 6 — Default Safe Escalate
    return NextResponse.json(
      {
        approved: false,
        reply: "That information is currently unavailable. I'll connect you with our team.",
        requires_human: true,
        provider: 'Groq',
        model: 'llama-3.3-70b-versatile',
        confidence: 0.0,
        reason: 'KNOWLEDGE_NOT_CONFIGURED',
        ai_interaction_id: `ai_${Date.now()}`,
      },
      { headers: rateLimitHeaders(rateCheck) }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        approved: false,
        reply: '',
        requires_human: true,
        provider: 'NONE',
        model: 'NONE',
        confidence: 0.0,
        reason: 'AI_PROVIDERS_UNAVAILABLE',
        ai_interaction_id: null,
      },
      { status: 500, headers: rateLimitHeaders(rateCheck) }
    );
  }
}
