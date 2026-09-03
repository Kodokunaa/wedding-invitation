# Brandon & Lourey Mae — Wedding website

Mostly static wedding invitation for September 9, 2026, prepared for Vercel. Ceremony 10 AM, reception 1 PM, Philippine time.

## Local development

- `npm ci`
- `npm run dev` — website and RSVP API at http://localhost:3000
- `npm test` — isolated validation and forwarding tests; no emails are sent
- `npx tsc --noEmit`
- `npm run build` — public output: `dist/client`

## Email RSVPs

The visible form posts to `/api/rsvp`. The server validates the fields and deadline, then preserves the POST while redirecting to **FormSubmit**, addressed only to **loureymae.apal@gmail.com**. FormSubmit handles CAPTCHA, recipient activation, delivery and its confirmation screen. Guest-supplied provider options such as CC, webhooks, or alternate redirect URLs are rejected.

**Required once:** submit the form and confirm the activation email sent by FormSubmit to the current recipient. Delivery is not verified until that activation is completed and a real response is checked in the inbox. Before switching to the testing recipient, on September 3, 2026, a browser submission through the local RSVP form returned the FormSubmit successful submission page. The test name was SETUP TEST - not a guest RSVP, with reference WEDDING-EMAIL-20260903. Inbox receipt and recipient activation still require confirmation; provider success alone does not verify delivery.

RSVPs remain open through **September 8, 2026 at 11:59 PM Philippine time**. Both the frontend and server enforce the deadline. The server can override it with `RSVP_DEADLINE`; update `app/wedding-config.ts` to keep displayed dates aligned.

The previously prepared spreadsheet workbook and Apps Script integration remain available but are **not used by the current email flow**. There are no spreadsheet credentials required for email RSVPs.

## Audio

The supplied track is stored in `public/audio/blue.mp3` and selected in `app/wedding-config.ts`. The audio player is already wired for attempted autoplay at 35%, continuous looping, volume up/down, mute/unmute, and a compact pill control. If a browser blocks autoplay, playback retries on the first page interaction.

The player uses the supplied MP3 directly. Click or drag the song area to set volume; the music icon toggles mute. The fill shows the current volume. No audio is extracted from streaming services.

## Content

- `app/wedding-config.ts`: dates, audio source, and optional guest/gift wording. Empty optional topics stay unpublished.
- `app/page.tsx`: guest information and photo placements.
- `public/photos/`: all 16 supplied photos.
- `public/wedding.ics`: calendar event start times.

## Vercel

See [DEPLOY.md](DEPLOY.md) for import settings and deployment steps.

Import the repository using the checked-in settings: Framework **Other**, build **npm run build**, output **dist/client**, Node **24.x**. `/api/rsvp.mjs` is a separate Node function. Set `SITE_URL` to the final https:// address for canonical/share metadata; the Vercel production domain is used as a fallback. No Sites deployment is needed.

No deployment has been performed. Before sharing with guests, activate FormSubmit and verify an email response.

References: [FormSubmit setup and activation](https://formsubmit.co/), [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [YouTube player API](https://developers.google.com/youtube/iframe_api_reference).




The testing recipient has been removed and delivery restored to loureymae.apal@gmail.com. Inbox delivery to this address still requires confirmation.



