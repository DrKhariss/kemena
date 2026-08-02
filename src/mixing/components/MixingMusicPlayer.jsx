import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

const STORAGE_KEY = "mixing-music-stopped";
// Demo track for local testing when Firebase battleMusicUrl and env are unset.
const DEMO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
const FALLBACK_URL = import.meta.env.VITE_MIXING_MUSIC_URL || DEMO_URL;

function wasStopped() {
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

function setStopped(value) {
  if (value) sessionStorage.setItem(STORAGE_KEY, "1");
  else sessionStorage.removeItem(STORAGE_KEY);
}

/**
 * Background Kemena track for account + admin.
 * Starts automatically (muted if the browser blocks sound), then unmutes
 * on the first click / key anywhere — no need to find the Play button.
 */
export default function MixingMusicPlayer() {
  const audioRef = useRef(null);
  const [src, setSrc] = useState(FALLBACK_URL);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "config", "mainPage"),
      (snap) => {
        if (!snap.exists()) return;
        const url = snap.data()?.battleMusicUrl;
        if (url) setSrc(url);
      },
      () => {
        /* keep fallback if Firestore is unreachable */
      },
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    let cancelled = false;
    audio.loop = true;
    audio.volume = 0.45;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onCanPlay = () => setReady(true);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("canplay", onCanPlay);

    const unmute = () => {
      if (cancelled || wasStopped() || !audio) return;
      audio.muted = false;
      setMuted(false);
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const armUnmute = () => {
      const unlock = () => {
        unmute();
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      };
      window.addEventListener("pointerdown", unlock);
      window.addEventListener("keydown", unlock);
      return unlock;
    };

    let removeUnlock = null;

    async function start() {
      if (wasStopped() || cancelled) return;

      // Prefer audible autoplay (works once the site has engagement).
      audio.muted = false;
      setMuted(false);
      try {
        await audio.play();
        return;
      } catch {
        /* fall through — browsers block unmuted autoplay */
      }

      // Always start the track muted so it runs without a Play tap.
      audio.muted = true;
      setMuted(true);
      try {
        await audio.play();
        if (!cancelled) removeUnlock = armUnmute();
      } catch {
        // Last resort: wait for any gesture, then play with sound.
        if (!cancelled) removeUnlock = armUnmute();
      }
    }

    start();

    return () => {
      cancelled = true;
      if (removeUnlock) {
        window.removeEventListener("pointerdown", removeUnlock);
        window.removeEventListener("keydown", removeUnlock);
      }
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("canplay", onCanPlay);
      audio.pause();
    };
  }, [src]);

  function stop() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    setStopped(true);
    setPlaying(false);
    setMuted(false);
  }

  function playAudible() {
    const audio = audioRef.current;
    if (!audio) return;
    setStopped(false);
    audio.muted = false;
    setMuted(false);
    audio.play().catch(() => {
      audio.muted = true;
      setMuted(true);
      audio.play().catch(() => {});
    });
  }

  if (!src) return null;

  const status = playing
    ? muted
      ? "Playing muted — click anywhere"
      : "Playing in background"
    : ready
      ? "Music paused"
      : "Loading track…";

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" playsInline />
      <div className="mixing-music" role="region" aria-label="Background music">
        <span className={`mixing-music__eq ${playing && !muted ? "is-on" : ""}`} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <div className="mixing-music__copy">
          <strong>Kemena</strong>
          <span>{status}</span>
        </div>
        {playing && !muted ? (
          <button type="button" className="mixing-music__btn" onClick={stop}>
            Stop
          </button>
        ) : playing && muted ? (
          <button type="button" className="mixing-music__btn mixing-music__btn--play" onClick={playAudible}>
            Unmute
          </button>
        ) : (
          <button type="button" className="mixing-music__btn mixing-music__btn--play" onClick={playAudible}>
            Play
          </button>
        )}
      </div>
    </>
  );
}
