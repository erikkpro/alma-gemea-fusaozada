import { useEffect, useRef, useState } from 'react';

type Props = { url: string; autoplay?: boolean; avatarUrl: string; time: string };

function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function AudioBubble({ url, autoplay, avatarUrl, time }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (autoplay) {
      const p = a.play();
      if (p) p.catch(() => void 0);
    }
  }, [autoplay]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => void 0);
    else a.pause();
  }

  function onTime() {
    const a = audioRef.current;
    if (!a) return;
    setCurrent(a.currentTime);
    setDuration(a.duration);
    if (a.duration) setProgress((a.currentTime / a.duration) * 100);
  }

  return (
    <div className="tb-host-bubble tb-audio-bubble">
      <div className="tb-bubble-audio">
        <div className="tb-audio-avatar">
          <img src={avatarUrl} alt="" />
          <span className="tb-mic-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#00bfa5">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
            </svg>
          </span>
        </div>
        <button className="tb-audio-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#54656f"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#54656f"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div className="tb-audio-track">
          <div className="tb-audio-bar">
            <div className="tb-audio-fill" style={{ width: `${progress}%` }} />
            <div className="tb-audio-knob" style={{ left: `${progress}%` }} />
          </div>
          <div className="tb-audio-time">{formatTime(playing || current > 0 ? current : duration)}</div>
        </div>
        <audio
          ref={audioRef}
          src={url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
          onTimeUpdate={onTime}
          onLoadedMetadata={onTime}
          preload="metadata"
        />
        <span className="tb-hora">{time}</span>
      </div>
    </div>
  );
}
