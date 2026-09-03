import { createHash } from 'node:crypto';
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const result = (body, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export function createRsvpHandler({
  env = process.env,
  send = fetch,
  now = Date.now,
} = {}) {
  const counters = new Map();
  return async function handle(request) {
    const ready = Boolean(env.RSVP_WEBHOOK_URL && env.RSVP_WEBHOOK_SECRET);
    const deadline = Date.parse(
      env.RSVP_DEADLINE || '2026-09-08T23:59:59+08:00',
    );
    const closed = now() > deadline;
    if (request.method === 'GET')
      return result({
        ready,
        closed,
        deadline: new Date(deadline).toISOString(),
      });
    if (request.method !== 'POST')
      return new Response(null, {
        status: 405,
        headers: { Allow: 'GET, POST' },
      });
    if (
      request.headers.get('origin') &&
      request.headers.get('origin') !== new URL(request.url).origin
    )
      return result(
        { error: 'Please submit your RSVP from our wedding website.' },
        403,
      );
    if (!request.headers.get('content-type')?.startsWith('application/json'))
      return result({ error: 'Unsupported form format.' }, 415);
    if (closed)
      return result(
        {
          error:
            'Online RSVPs have closed. Please contact the couple directly.',
        },
        410,
      );
    if (!ready)
      return result(
        {
          error:
            'Online RSVPs are unavailable right now. Please contact Brandon or Lourey Mae directly.',
        },
        503,
      );
    if (
      !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(
        env.RSVP_WEBHOOK_URL,
      )
    )
      return result({ error: 'Online RSVPs are unavailable right now.' }, 503);
    let body;
    try {
      const reader = request.body?.getReader();
      if (!reader) return result({ error: 'Please complete the form.' }, 400);
      let size = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 8192) {
          await reader.cancel();
          return result({ error: 'Your message is too long.' }, 413);
        }
        chunks.push(value);
      }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return result({ error: 'Please check your RSVP and try again.' }, 400);
    }
    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body) ||
      body.website
    )
      return result({ error: 'Please complete the form.' }, 400);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const note = typeof body.note === 'string' ? body.note.trim() : '';
    if (name.length < 2 || name.length > 120 || /[\r\n\x00-\x1f]/.test(name))
      return result(
        { error: 'Please enter your full name (2–120 characters).' },
        400,
      );
    if (email.length > 254 || !emailPattern.test(email))
      return result({ error: 'Please enter a valid email address.' }, 400);
    if (!['yes', 'no'].includes(body.attendance))
      return result({ error: 'Please select whether you will attend.' }, 400);
    if (note.length > 1500)
      return result(
        { error: 'Please keep your note under 1,500 characters.' },
        400,
      );
    if (body.consent !== true)
      return result(
        {
          error:
            'Please confirm that we may use your details to manage your RSVP.',
        },
        400,
      );
    const minute = Math.floor(now() / 60000),
      key = createHash('sha256').update(email).digest('hex');
    for (const [id, entry] of counters)
      if (entry.minute !== minute) counters.delete(id);
    const entry = counters.get(key) || { minute, count: 0 };
    if (entry.count >= 3)
      return result(
        { error: 'Please wait a minute before trying again.' },
        429,
      );
    if (counters.size < 1000) {
      entry.count++;
      counters.set(key, entry);
    }
    const response = {
      name,
      email,
      attendance: body.attendance,
      note,
      consent: true,
    };
    const responseId = createHash('sha256')
      .update(JSON.stringify(response))
      .digest('hex');
    try {
      const saved = await send(env.RSVP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...response,
          responseId,
          secret: env.RSVP_WEBHOOK_SECRET,
        }),
        signal: AbortSignal.timeout(12000),
      });
      if (!saved.ok) throw new Error();
      const receipt = await saved.json();
      if (receipt.ok !== true || receipt.responseId !== responseId)
        throw new Error();
      return result({ ok: true });
    } catch {
      return result(
        {
          error:
            'We could not confirm your RSVP. Please try again; duplicate responses are prevented.',
        },
        502,
      );
    }
  };
}
export default { fetch: createRsvpHandler() };
