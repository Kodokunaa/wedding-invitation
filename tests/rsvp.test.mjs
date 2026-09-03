import test from 'node:test';
import assert from 'node:assert/strict';
import { createRsvpHandler } from '../api/rsvp.mjs';
const now = () => Date.parse('2026-09-05T10:00:00+08:00');
const valid = {
  name: 'Sample Guest',
  email: 'sample@example.com',
  attendance: 'Joyfully accepts',
  note: '',
  consent: 'on',
  _subject: 'Wedding RSVP — Brandon & Lourey Mae',
  _template: 'table',
  _honey: '',
};
const request = (fields = valid, origin = 'https://wedding.example') =>
  new Request('https://wedding.example/api/rsvp', {
    method: 'POST',
    headers: { Origin: origin },
    body: new URLSearchParams(fields),
  });
test('valid form preserves POST to the exact requested recipient', async () => {
  const response = await createRsvpHandler({ env: {}, now })(request());
  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get('Location'),
    'https://formsubmit.co/loureymae.apal@gmail.com',
  );
});
test('declines are submitted as well as acceptances', async () => {
  assert.equal(
    (
      await createRsvpHandler({ env: {}, now })(
        request({ ...valid, attendance: 'Regretfully declines' }),
      )
    ).status,
    307,
  );
});
test('deadline closes at midnight Philippine time', async () => {
  const closed = createRsvpHandler({
    env: {},
    now: () => Date.parse('2026-09-09T00:00:00+08:00'),
  });
  assert.equal((await closed(request())).status, 410);
  const open = createRsvpHandler({
    env: {},
    now: () => Date.parse('2026-09-08T23:59:58+08:00'),
  });
  assert.equal((await open(request())).status, 307);
});
test('email flow needs no spreadsheet credentials', async () => {
  const response = await createRsvpHandler({ env: {}, now })(
    new Request('https://wedding.example/api/rsvp'),
  );
  assert.equal((await response.json()).ready, true);
});
test('invalid guests and missing consent cannot reach email provider', async () => {
  const handler = createRsvpHandler({ env: {}, now });
  for (const fields of [
    { ...valid, name: '' },
    { ...valid, email: 'bad' },
    { ...valid, attendance: 'maybe' },
    { ...valid, consent: '' },
    { ...valid, note: 'x'.repeat(1501) },
    { ...valid, _honey: 'spam' },
  ]) {
    const response = await handler(request(fields));
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('Location'), null);
  }
});
test('injected provider CC and webhook options are blocked', async () => {
  const handler = createRsvpHandler({ env: {}, now });
  for (const key of ['_cc', '_webhook', '_next', '_captcha'])
    assert.equal(
      (await handler(request({ ...valid, [key]: 'unexpected' }))).status,
      400,
    );
});
test('cross-origin and unsupported methods are rejected', async () => {
  const handler = createRsvpHandler({ env: {}, now });
  assert.equal(
    (await handler(request(valid, 'https://another.example'))).status,
    403,
  );
  assert.equal(
    (
      await handler(
        new Request('https://wedding.example/api/rsvp', { method: 'DELETE' }),
      )
    ).status,
    405,
  );
});
test('oversized requests stop before forwarding', async () => {
  assert.equal(
    (
      await createRsvpHandler({ env: {}, now })(
        request({ ...valid, note: 'x'.repeat(17000) }),
      )
    ).status,
    413,
  );
});


