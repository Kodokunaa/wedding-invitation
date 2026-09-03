const recipient = 'loureymae.apal@gmail.com';
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
function failure(message, status) {
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Wedding RSVP</title><body style="font:18px/1.7 Georgia,serif;background:#faf8f3;color:#514f48;max-width:520px;margin:10vh auto;padding:24px"><h1>Please check your RSVP</h1><p>${message}</p><a href="/#rsvp">Return to the RSVP form</a></body></html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    },
  );
}
export function createRsvpHandler({ env = process.env, now = Date.now } = {}) {
  return async function handle(request) {
    const deadline = Date.parse(
      env.RSVP_DEADLINE || '2026-09-08T23:59:59+08:00',
    );
    const closed = !Number.isFinite(deadline) || now() > deadline;
    if (request.method === 'GET')
      return Response.json(
        {
          ready: true,
          closed,
          deadline: Number.isFinite(deadline)
            ? new Date(deadline).toISOString()
            : null,
        },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    if (request.method !== 'POST')
      return new Response(null, {
        status: 405,
        headers: { Allow: 'GET, POST' },
      });
    if (
      request.headers.get('origin') &&
      request.headers.get('origin') !== new URL(request.url).origin
    )
      return failure('Please submit from our wedding website.', 403);
    if (closed)
      return failure(
        'Online RSVPs have closed. Please contact Brandon or Lourey Mae directly.',
        410,
      );
    if (
      !request.headers
        .get('content-type')
        ?.startsWith('application/x-www-form-urlencoded')
    )
      return failure('Please use the RSVP form on our website.', 415);
    let form;
    try {
      const reader = request.body?.getReader();
      if (!reader) return failure('Please complete the form.', 400);
      let size = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 16384) {
          await reader.cancel();
          return failure('Your message is too long.', 413);
        }
        chunks.push(value);
      }
      form = new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return failure('Please check your form and try again.', 400);
    }
    const name = (form.get('name') || '').trim(),
      email = (form.get('email') || '').trim();
    if (name.length < 2 || name.length > 120 || /[\r\n\x00-\x1f]/.test(name))
      return failure('Please enter your full name.', 400);
    if (email.length > 254 || !emailPattern.test(email))
      return failure('Please enter a valid email address.', 400);
    if (
      !['Joyfully accepts', 'Regretfully declines'].includes(
        form.get('attendance'),
      )
    )
      return failure('Please choose whether you will attend.', 400);
    if ((form.get('note') || '').length > 1500 || form.get('_honey'))
      return failure('Please check your form and try again.', 400);
    if (form.get('consent') !== 'on')
      return failure(
        'Please confirm that you agree to share your RSVP with the couple.',
        400,
      );
    // Only these fields may reach the provider; block injected recipient/CC/webhook options.
    const allowed = new Set([
      'name',
      'email',
      'attendance',
      'note',
      'consent',
      '_honey',
      '_subject',
      '_template',
    ]);
    if ([...form.keys()].some((key) => !allowed.has(key)))
      return failure('Please use the RSVP form on our website.', 400);
    if (
      form.get('_subject') !== 'Wedding RSVP — Brandon & Lourey Mae' ||
      form.get('_template') !== 'table'
    )
      return failure('Please use the RSVP form on our website.', 400);
    // 307 preserves the form POST. FormSubmit handles captcha, activation and confirmation.
    return new Response(null, {
      status: 307,
      headers: {
        Location: `https://formsubmit.co/${recipient}`,
        'Cache-Control': 'no-store',
      },
    });
  };
}
export default { fetch: createRsvpHandler() };


