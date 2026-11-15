import {ApiError, FinishReason, GoogleGenAI, ThinkingLevel, type Content} from '@google/genai';

import {getCloudflareContext} from '@opennextjs/cloudflare';

import {LANE_LIMITS, LANE_SYSTEM} from '@/lib/lane';

// agentLane's replies, streamed as plain text from Google's Gemini. The browser sends the whole conversation each
// time; the reply streams back a few words at a time. The key is GEMINI_API_KEY: .env.local on a computer, a
// Worker secret on Cloudflare (`npx wrangler secret put GEMINI_API_KEY`). Without it the endpoint says Lane is offline and points to the contact page.

const MODEL = 'gemini-3.8-flash';
const OFFLINE = 'Lane is offline right now. Send us a brief at /contact and we’ll reply ourselves.';

// Made on first use, so a missing key turns into the offline message rather than a crash when the route loads.
let ai: GoogleGenAI | undefined;

// A guard against one visitor flooding the endpoint: at most 12 requests a minute each. On Cloudflare it's the
// LANE_LIMITER binding in wrangler.jsonc, counted at the edge so it holds across restarts and servers. Anywhere
// without that binding it falls back to counting in memory.
const PER_MINUTE = 12;
const seen = new Map<string, number[]>();
function allowedInMemory(key: string) {
  const now = Date.now();
  // Forget addresses that have gone quiet, so the map doesn't grow without end.
  if (seen.size > 5000) for (const [k, times] of seen) if (now - times[times.length - 1] >= 60_000) seen.delete(k);
  const recent = (seen.get(key) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  seen.set(key, recent);
  return recent.length <= PER_MINUTE;
}

async function allowed(key: string) {
  const limiter = getCloudflareContext().env.LANE_LIMITER;
  if (!limiter) return allowedInMemory(key);
  try {
    return (await limiter.limit({key})).success;
  } catch (error) {
    // If the limiter itself fails, let the message through rather than lock everyone out.
    console.error('[lane] rate limiter', error);
    return allowedInMemory(key);
  }
}

const fail = (status: number, message: string) => Response.json({error: message}, {status});

/** Only alternating visitor and Lane text, starting and ending with the visitor, within the limits. */
function parse(body: unknown): Content[] | null {
  const list = (body as {messages?: unknown})?.messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > LANE_LIMITS.messages) return null;
  const out: Content[] = [];
  for (const [i, m] of list.entries()) {
    const role = (m as {role?: unknown})?.role;
    const content = (m as {content?: unknown})?.content;
    const expected = i % 2 === 0 ? 'user' : 'assistant';
    if (role !== expected || typeof content !== 'string') return null;
    const text = content.trim();
    if (!text || text.length > LANE_LIMITS.chars * (role === 'assistant' ? 4 : 1)) return null;
    // Gemini calls the assistant's turns "model".
    out.push({role: expected === 'user' ? 'user' : 'model', parts: [{text}]});
  }
  return out.at(-1)?.role === 'user' ? out : null;
}

export async function POST(request: Request) {
  // Cloudflare names the visitor in cf-connecting-ip; other hosts in x-forwarded-for.
  const who = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (!(await allowed(who))) return fail(429, 'Too many messages at once. Give it a minute and try again.');

  const contents = parse(await request.json().catch(() => null));
  if (!contents) return fail(400, 'That message couldn’t be sent. Try a shorter one.');

  const key = process.env.GEMINI_API_KEY;
  if (!key) return fail(503, OFFLINE);
  ai ??= new GoogleGenAI({apiKey: key});

  const abort = new AbortController();
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = await ai!.models.generateContentStream({
          model: MODEL,
          contents,
          config: {
            systemInstruction: LANE_SYSTEM,
            maxOutputTokens: 2048,
            // Chat answers about a fixed set of facts: little thinking keeps replies quick.
            thinkingConfig: {thinkingLevel: ThinkingLevel.LOW},
            abortSignal: abort.signal,
          },
        });
        let blocked = false;
        for await (const chunk of stream) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          const finish = chunk.candidates?.[0]?.finishReason;
          if (chunk.promptFeedback?.blockReason || finish === FinishReason.SAFETY || finish === FinishReason.PROHIBITED_CONTENT) blocked = true;
        }
        if (blocked) controller.enqueue(encoder.encode('\n\nI can’t help with that one. For anything about your project, send us a brief at /contact.'));
        controller.close();
      } catch (error) {
        if (abort.signal.aborted) return;
        // The status line is already sent, so the error travels as a marked line the chat window recognises.
        const status = error instanceof ApiError ? error.status : 0;
        console.error('[lane]', error instanceof ApiError ? `${error.status} ${error.message}` : error);
        const message =
          status === 429 ? 'Lane is busy. Try again in a moment.'
          : status === 400 || status === 401 || status === 403 || status === 0 ? OFFLINE
          : 'Something went wrong. Try again, or send us a brief at /contact.';
        controller.enqueue(encoder.encode(`\u0000${message}`));
        controller.close();
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store'}});
}
