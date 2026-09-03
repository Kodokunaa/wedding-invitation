# Deploy the wedding website on Vercel

This project uses Vinext to export the website as static files, with a Vercel Node function for RSVP validation. Select **Other**, not Next.js, when importing.

## Import from Git

1. Push the entire project to your Git repository, including public/photos, public/audio, public/video, api, scripts, package-lock.json, and vercel.json.
2. In Vercel, choose Add New > Project and import the repository.
3. Use these settings (vercel.json supplies the install, build and output settings):

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root directory | The directory containing package.json |
| Install command | npm ci |
| Build command | npm run build |
| Output directory | dist/client |
| Node.js version | 24.x |

4. Deploy. No database or email API key is required.
5. If using a custom domain, set SITE_URL to its complete https:// URL and redeploy so canonical/share metadata uses the intended site origin. Without it, metadata uses Vercel's production-domain environment variable.

Do not upload only dist/client: that leaves out the RSVP function.

## Deploy from your computer instead

From the project directory, run:

    npx vercel

Follow the prompts and choose Other if asked for the framework. To publish to production after reviewing the preview:

    npx vercel --prod

## Final live checks

- Submit one clearly labeled test RSVP and check loureymae.apal@gmail.com, including Spam. Complete FormSubmit activation if requested.
- Confirm the form closes after September 8, 2026 at 11:59:59 PM Philippine time.
- Open the gallery, play the montage, and check music volume/mute on a phone.
- Download the calendar file and check the ceremony and reception times.
- Check both Google Maps destinations.

The RSVP form redirects to FormSubmit for submission and confirmation. A successful provider page is not proof of inbox delivery.

The montage and song are included as local media files. Audible autoplay still depends on the guest's browser allowing it.

This document prepares deployment; no deployment has been created automatically.

