import type { Metadata } from 'next';
import './globals.css';
import Music from './music';
const configuredOrigin =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);
const origin = configuredOrigin ? new URL(configuredOrigin) : undefined;
const title = 'Brandon & Lourey Mae | September 9, 2026';
const description =
  'Join us for our wedding on September 9, 2026. Find ceremony and reception details, the day’s timeline, attire inspiration, photos, and RSVP.';
export const metadata: Metadata = {
  ...(origin ? { metadataBase: origin, alternates: { canonical: '/' } } : {}),
  title,
  description,
  icons: { icon: '/favicon.svg' },
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    title,
    description,
    locale: 'en_PH',
    ...(origin
      ? {
          url: origin.href,
          images: [
            {
              url: new URL('/og.png', origin).href,
              width: 1731,
              height: 909,
              alt: 'Brandon & Lourey Mae — September 9, 2026',
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    ...(origin ? { images: [new URL('/og.png', origin).href] } : {}),
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#invitation">
          Skip to wedding details
        </a>
        {children}
        <Music />
      </body>
    </html>
  );
}
