'use client';

import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { Music2, VolumeX } from 'lucide-react';
import { musicSource } from './wedding-config';

export default function Music() {
  const audio = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(35);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    let disposed = false;
    element.volume = 0.35;
    const start = () => {
      if (!element.paused || Array.from(document.querySelectorAll<HTMLVideoElement>('[data-wedding-montage]')).some(video => !video.paused && !video.error)) return;
      void element.play().then(() => {
        if (!disposed) setBlocked(false);
      }).catch(() => {
        if (!disposed) setBlocked(true);
      });
    };
    const syncMontage = () => {
      const playing = Array.from(document.querySelectorAll<HTMLVideoElement>('[data-wedding-montage]')).some(video => !video.paused && !video.error);
      if (playing) element.pause();
      else start();
    };
    window.addEventListener('wedding-montage-change', syncMontage);
    start();
    // Retry on an ordinary page interaction if the browser blocks initial sound.
    document.addEventListener('pointerdown', start);
    document.addEventListener('keydown', start);
    return () => {
      disposed = true;
      window.removeEventListener('wedding-montage-change', syncMontage);
      document.removeEventListener('pointerdown', start);
      document.removeEventListener('keydown', start);
      element.pause();
    };
  }, []);

  function changeVolume(next: number) {
    next = Math.max(0, Math.min(100, Math.round(next)));
    setVolume(next);
    setMuted(next === 0);
    if (audio.current) {
      audio.current.volume = next / 100;
      audio.current.muted = next === 0;
    }
  }

  function toggleMute() {
    const next = !(muted || volume === 0);
    if (!next && volume === 0) changeVolume(35);
    setMuted(next);
    if (audio.current) audio.current.muted = next;
  }

  function setFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    changeVolume(((event.clientX - bounds.left) / bounds.width) * 100);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = {
      ArrowRight: volume + 5, ArrowUp: volume + 5,
      ArrowLeft: volume - 5, ArrowDown: volume - 5,
      Home: 0, End: 100,
    }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      changeVolume(next);
    }
  }

  const silent = muted || volume === 0;
  const caption = error ? 'Music unavailable' : silent ? 'Muted' : blocked ? 'Sound starts on interaction' : 'Our wedding song';
  return (
    <aside className="music-control" aria-label="Wedding music">
      {musicSource && <audio ref={audio} src={musicSource} loop preload="auto"
        onPlaying={() => { setBlocked(false); setError(false); }}
        onError={() => setError(true)} />}
      <div className="music-pill">
        <button type="button" className="music-mute" onClick={toggleMute}
          aria-label={silent ? 'Unmute music' : 'Mute music'} aria-pressed={silent}
          title={silent ? 'Unmute music' : 'Mute music'}>
          {silent ? <VolumeX size={19} /> : <Music2 size={19} />}
        </button>
        <div className="music-level" role="slider" tabIndex={0}
          aria-label="Music volume" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={silent ? 0 : volume} aria-valuetext={silent ? 'Muted' : volume + '%'}
          title="Click or drag to adjust volume"
          onPointerDown={event => {
            if (event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            setFromPointer(event);
          }}
          onPointerMove={event => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event);
          }}
          onPointerUp={event => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onKeyDown={onKeyDown}>
          <span className="music-level-fill" style={{ width: (silent ? 0 : volume) + '%' }} aria-hidden="true" />
          <span className="music-label"><strong>blue · yung kai</strong><small>{caption}</small></span>
          <span className="music-percentage" aria-hidden="true">{silent ? 0 : volume}%</span>
        </div>
      </div>
    </aside>
  );
}

