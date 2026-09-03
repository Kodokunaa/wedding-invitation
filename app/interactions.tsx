'use client';
import Monogram from './monogram';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { wedding } from './wedding-config';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Our day', 'invitation'],
    ['Timeline', 'timeline'],
    ['Venue', 'venue'],
    ['Attire', 'attire'],
    ['Gallery', 'gallery'],
    ['Details', 'faq'],
  ];
  return (
    <header className="site-header">
      <a
        className="monogram"
        href="#home"
        aria-label="Brandon and Lourey Mae, back to top"
      >
        <Monogram />
      </a>
      <nav className="desktop-nav" aria-label="Wedding navigation">
        {links.map(([title, id]) => (
          <a key={id} href={'#' + id}>
            {title}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="nav-rsvp" href="#rsvp">
          RSVP ↗
        </a>
        <Button
          variant="ghost"
          className="mobile-menu-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          ☰
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="mobile-menu">
          <DialogTitle>Our wedding day</DialogTitle>
          <DialogDescription>
            Brandon & Lourey Mae · September 9, 2026
          </DialogDescription>
          <nav aria-label="Mobile navigation">
            {[...links, ['Reminders', 'reminders'], ['RSVP', 'rsvp']].map(
              ([title, id]) => (
                <a key={id} href={'#' + id} onClick={() => setOpen(false)}>
                  {title}
                  <span>↗</span>
                </a>
              ),
            )}
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () =>
      setRemaining(Math.max(0, Date.parse(wedding.ceremony) - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (remaining === 0)
    return (
      <p className="wedding-day-message">
        Our forever has begun. Thank you for being part of our story.
      </p>
    );
  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, i) => (
        <div key={label}>
          <strong>
            {remaining === null
              ? '—'
              : String(
                  Math.floor(remaining / [86400000, 3600000, 60000, 1000][i]) %
                    [Infinity, 24, 60, 60][i],
                ).padStart(2, '0')}
          </strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
const descriptions = [
  'Together beside blue flowers',
  'Standing together with the mountain behind',
  'A portrait with a mountain view',
  'Hand in hand on the steps',
  'Resting on a shoulder under the tree',
  'An embrace under leafy branches',
  'Looking back together at the gate',
  'A smile and a mountain view',
  'A kiss among the blue flowers',
  'Facing each other beneath the branches',
  'Joined hands and an engagement ring',
  'Walking together through the city at night',
  'An embrace with a mountain view',
  'Sharing a smile beside the flowers',
  'A quiet moment together',
  'Back to back with the mountain behind',
];
const order = [5, 11, 6, 9, 12, 13, 1, 7, 16, 8, 10, 14, 2, 15, 3, 4];
export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const move = (step: number) =>
    setSelected((v) =>
      v === null ? v : (v + step + order.length) % order.length,
    );
  return (
    <>
      <div className="photo-grid">
        {order.slice(0, all ? 16 : 6).map((id, index) => (
          <Button
            key={id}
            variant="ghost"
            className={'photo-tile photo-' + index}
            onClick={() => setSelected(index)}
            aria-label={'Enlarge photo: ' + descriptions[id - 1]}
          >
            <img
              src={'/photos/' + id + '.jpg'}
              alt={descriptions[id - 1]}
              loading="lazy"
              decoding="async"
            />
            <span>VIEW PHOTO ↗</span>
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        className="button gallery-more"
        aria-expanded={all}
        onClick={() => setAll(!all)}
      >
        {all ? 'Show fewer photos' : 'Explore all 16 photographs'}{' '}
        <span>{all ? '−' : '+'}</span>
      </Button>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="lightbox"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              move(1);
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              move(-1);
            }
          }}
        >
          <DialogTitle className="sr-only">Our photo gallery</DialogTitle>
          <DialogDescription className="sr-only">
            Swipe, or use the previous and next buttons or arrow keys to browse.
            Press Escape to close.
          </DialogDescription>
          {selected !== null && (
            <>
              <img
                src={'/photos/' + order[selected] + '.jpg'}
                alt={descriptions[order[selected] - 1]}
                onTouchStart={(e) => {
                  touch.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                  };
                }}
                onTouchEnd={(e) => {
                  if (!touch.current) return;
                  const dx = e.changedTouches[0].clientX - touch.current.x;
                  const dy = e.changedTouches[0].clientY - touch.current.y;
                  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy))
                    move(dx < 0 ? 1 : -1);
                  touch.current = null;
                }}
              />
              <div className="lightbox-controls">
                <Button
                  variant="ghost"
                  onClick={() => move(-1)}
                  aria-label="Previous photo"
                >
                  ←
                </Button>
                <span aria-live="polite">{selected + 1} / 16</span>
                <Button
                  variant="ghost"
                  onClick={() => move(1)}
                  aria-label="Next photo"
                >
                  →
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function RSVP() {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const check = () =>
      setClosed(Date.now() > Date.parse(wedding.rsvpDeadline));
    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, []);
  if (closed)
    return (
      <div className="rsvp-availability">
        <h3>Need to update your RSVP?</h3>
        <p>
          Online RSVPs have closed. Please email Lourey Mae directly if your
          plans have changed.
        </p>
        <a className="text-link" href="mailto:loureymae.apal@gmail.com">
          Email us ↗
        </a>
      </div>
    );
  return (
    <form className="rsvp-form" action="/api/rsvp" method="POST">
      <p className="rsvp-deadline">
        Kindly respond by September 8, 2026, at 11:59 PM Philippine time.
      </p>
      <input
        type="hidden"
        name="_subject"
        value="Wedding RSVP — Brandon & Lourey Mae"
      />
      <input type="hidden" name="_template" value="table" />
      <label htmlFor="guest-name">Your full name</label>
      <Input
        id="guest-name"
        name="name"
        autoComplete="name"
        placeholder="First and last name"
        required
        minLength={2}
        maxLength={120}
      />
      <label htmlFor="guest-email">Email address</label>
      <Input
        id="guest-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
        maxLength={254}
      />
      <fieldset>
        <legend>Will you join us?</legend>
        <label>
          <input
            type="radio"
            name="attendance"
            value="Joyfully accepts"
            required
          />{' '}
          Joyfully accepts
        </label>
        <label>
          <input
            type="radio"
            name="attendance"
            value="Regretfully declines"
            required
          />{' '}
          Regretfully declines
        </label>
      </fieldset>
      <label htmlFor="guest-note">
        A note for the couple <span>(optional)</span>
      </label>
      <Textarea
        id="guest-note"
        name="note"
        placeholder="A little love, or anything we should know…"
        maxLength={1500}
      />
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="website">Leave this blank</label>
        <input name="_honey" id="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree to share these details with the couple to manage my RSVP.
        </span>
      </label>
      <p className="privacy-note">
        Your RSVP is delivered by email. FormSubmit handles delivery and
        will show a confirmation page after submission.
      </p>
      <Button type="submit" className="button">
        Send RSVP <span>↗</span>
      </Button>
      <p className="rsvp-email-alternative">
        Prefer to email directly?{' '}
        <a href="mailto:loureymae.apal@gmail.com">loureymae.apal@gmail.com</a>
      </p>
    </form>
  );
}



