'use client';

import { useEffect, useRef } from 'react';

export default function Montage() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = false;
    let disposed = false;
    const start = () => {
      if (!visible || !element.paused) return;
      void element.play().then(() => {
        if (disposed || !visible) element.pause();
      }).catch(() => {
        // Retry on the next page interaction when audible autoplay is blocked.
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      if (visible) start();
      else element.pause();
    }, { threshold: [0, 0.25] });
    observer.observe(element);
    document.addEventListener('pointerdown', start);
    document.addEventListener('keydown', start);
    return () => {
      disposed = true;
      observer.disconnect();
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
    loop playsInline preload="metadata"
    onPlaying={notifyMusic} onPause={notifyMusic} onError={notifyMusic}
  />;
}
