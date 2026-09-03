'use client';

import { useEffect, useRef } from 'react';

export default function Montage() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;

    let disposed = false;
    const start = () => {
      if (document.documentElement.dataset.invitationOpen !== 'true') return;
      if (!element.paused) return;
      void element.play().then(() => {
        if (disposed) element.pause();
      }).catch(async (error: unknown) => {
        if (disposed || !(error instanceof DOMException) || error.name !== 'NotAllowedError') return;
        // Audible autoplay may be denied; keep the background moving without a click.
        element.muted = true;
        notifyMusic();
        try {
          await element.play();
          if (disposed) element.pause();
        } catch {
          // Media/device restrictions can still prevent playback.
        }
      });
    };
    window.addEventListener('wedding-invitation-open', start);
    start();
    document.addEventListener('pointerdown', start);
    document.addEventListener('keydown', start);
    return () => {
      disposed = true;
      window.removeEventListener('wedding-invitation-open', start);

      document.removeEventListener('pointerdown', start);
      document.removeEventListener('keydown', start);
      element.pause();
    };
  }, []);

  function notifyMusic() {
    window.dispatchEvent(new Event('wedding-montage-change'));
  }

  return <video ref={video} className="montage-video" data-wedding-montage
    src="/video/montage.mp4" poster="/photos/6.jpg"
    aria-label="Brandon and Lourey Mae montage"
    muted loop playsInline preload="auto"
    onPlaying={notifyMusic} onPause={notifyMusic} onError={notifyMusic}
  />;
}



