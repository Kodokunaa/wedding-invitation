'use client';

import { useEffect, useRef } from 'react';

export default function Montage() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;

    let disposed = false;
    const start = () => {
      if (!element.paused) return;
      void element.play().then(() => {
        if (disposed) element.pause();
      }).catch(() => {
        // Retry on the next page interaction when audible autoplay is blocked.
      });
    };
    start();
    document.addEventListener('pointerdown', start);
    document.addEventListener('keydown', start);
    return () => {
      disposed = true;

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
    autoPlay loop playsInline preload="auto"
    onPlaying={notifyMusic} onPause={notifyMusic} onError={notifyMusic}
  />;
}

