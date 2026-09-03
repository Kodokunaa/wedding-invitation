'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function InvitationGate({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [entering, setEntering] = useState(false);
  useEffect(() => {
    if (!entering) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setOpened(true), reduced ? 0 : 850);
    return () => clearTimeout(timer);
  }, [entering]);
  const [unsealed, setUnsealed] = useState(false);



  useEffect(() => {
    if (!unsealed) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setEntering(true), reduced ? 0 : 2600);
    return () => clearTimeout(timer);
  }, [unsealed]);


  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opened) content.current?.focus({ preventScroll: true });
  }, [opened]);

  function openInvitation() {
    if (unsealed || entering || opened) return;
    document.documentElement.dataset.invitationOpen = 'true';
    setUnsealed(true);
    // Run play() in the click handler so audible playback has user activation.
    const song = content.current?.querySelector('audio');
    if (song) {
      song.volume = 0.35;
      void song.play().catch(() => {});
    }
    const montage = content.current?.querySelector('video');
    if (montage) {
      montage.muted = true;
      void montage.play().catch(() => {});
    }
    window.dispatchEvent(new Event('wedding-invitation-open'));
  }

  return <>
    {!opened && <section className={"invitation-cover" + (entering ? " is-entering" : "")} aria-label="Wedding invitation" inert={entering}>
      <div className="motif-background" aria-hidden="true">
        <div className="motif-arch" />
        <div className="motif-bouquet motif-bouquet-left">
          {Array.from({ length: 7 }, (_, i) => <span className={'motif-flower flower-' + i} key={i}><i /></span>)}
        </div>
        <div className="motif-bouquet motif-bouquet-right">
          {Array.from({ length: 7 }, (_, i) => <span className={'motif-flower flower-' + i} key={i}><i /></span>)}
        </div>
        {Array.from({ length: 12 }, (_, i) => <span key={i} className="motif-petal"
          style={{ left: ((i * 29 + 7) % 100) + '%', animationDelay: (-i * 1.7) + 's', animationDuration: (18 + i % 5) + 's' }} />)}
      </div>
      <p className="eyebrow">Together with our families</p>
      <h1>Brandon <em>&</em> Lourey Mae</h1>
      <p className="cover-date">SEPTEMBER 09, 2026 <span>·</span> YOU ARE INVITED</p>
      <div className={'envelope envelope-interactive' + (unsealed ? ' is-open' : '')}>
        <div className="envelope-letter">
          <span>With love, we invite you</span>
          <strong>Brandon & Lourey Mae</strong>
          <span className="paper-date">09 · 09 · 2026</span>
          <span className="paper-enter">Our forever begins here</span></div>
        <span className="envelope-pocket" aria-hidden="true" />
        <svg className="envelope-botanical" viewBox="0 0 460 300" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 279C42 233 52 199 90 166M33 254C22 239 18 222 22 211C38 220 41 238 33 254ZM43 230C61 231 73 220 78 208C58 207 49 215 43 230ZM54 206C42 193 44 177 48 170C62 179 65 193 54 206ZM68 188C88 190 100 179 104 169C87 167 76 176 68 188Z"/>
            <path d="M435 279C418 233 408 199 370 166M427 254C438 239 442 222 438 211C422 220 419 238 427 254ZM417 230C399 231 387 220 382 208C402 207 411 215 417 230ZM406 206C418 193 416 177 412 170C398 179 395 193 406 206ZM392 188C372 190 360 179 356 169C373 167 384 176 392 188Z"/>
            <path d="M77 178C67 165 70 151 81 154C79 139 95 137 99 150C109 141 120 153 111 163C125 167 119 182 106 178C104 191 89 190 88 178C82 185 75 184 77 178Z"/>
            <path d="M383 178C393 165 390 151 379 154C381 139 365 137 361 150C351 141 340 153 349 163C335 167 341 182 354 178C356 191 371 190 372 178C378 185 385 184 383 178Z"/>
          </g>
        </svg>
        <span className="envelope-flap" aria-hidden="true" />
        <span className="envelope-seal" aria-hidden="true"><span className="seal-crest">B<i>&</i>L</span></span>
        <span className="envelope-address" aria-hidden="true">To our dearest family & friends</span>
        {!unsealed && <button className="envelope-open-trigger" type="button"
          onClick={openInvitation} aria-label="Open the envelope and enter the wedding website" />}
      </div>
      <p className="envelope-prompt" aria-live="polite">{unsealed ? 'Your invitation is opening…' : 'Tap the envelope to open'}</p>
      <p className="envelope-note">Our celebration begins with a little music.</p>
    </section>}
    <div ref={content} tabIndex={-1} hidden={!opened && !entering} inert={!opened} className={"invitation-content" + (entering ? " is-revealing" : "")}>{children}</div>
  </>;
}








