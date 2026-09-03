"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";

const AUDIO_SRC = "/backsound/backsound.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Fungsi untuk unmute dengan efek fade-in lembut
  const unmuteWithFadeIn = useCallback(() => {
    // 1. Unmute & play pada elemen audio utama
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
            setIsPlaying(true);

            // Efek fade-in volume dari 0.05 menuju 0.65 secara bertahap
            const targetVolume = 0.65;
            let currentVol = 0.05;
            audio.volume = currentVol;

            const fadeInterval = setInterval(() => {
              if (!audio) {
                clearInterval(fadeInterval);
                return;
              }
              currentVol = Math.min(targetVolume, currentVol + 0.05);
              audio.volume = currentVol;
              if (currentVol >= targetVolume) {
                clearInterval(fadeInterval);
              }
            }, 60);
          })
          .catch(() => {
            audio.muted = true;
          });
      }
    }

    // 2. Kirim sinyal unmute & play ke iframe delegation
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { target: "audio-frame", action: "UNMUTE" },
        "*"
      );
    } catch {}
  }, []);

  const togglePlay = (e?: React.MouseEvent | React.SyntheticEvent) => {
    e?.stopPropagation?.();
    const audio = audioRef.current;

    // Jika sedang muted atau pause -> langsung aktifkan & unmute
    if (isMuted || !isPlaying) {
      unmuteWithFadeIn();
    } else {
      if (audio) audio.pause();
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { target: "audio-frame", action: "PAUSE" },
          "*"
        );
      } catch {}
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 1. Ekpos fungsi trigger unmute & play ke window global
    if (typeof window !== "undefined") {
      (window as any).__unmuteMusic = unmuteWithFadeIn;
      (window as any).__triggerPlayMusic = unmuteWithFadeIn;
    }

    // 2. Muted Autoplay pada elemen audio utama
    audio.defaultMuted = true;
    audio.muted = true;
    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(true);
        })
        .catch(() => {});
    }

    // 3. Listener komunikasi postMessage dari audio iframe
    const handleFrameMessage = (event: MessageEvent) => {
      if (event.data?.source === "audio-frame") {
        if (event.data.status === "PLAYING") {
          setIsPlaying(true);
          setIsMuted(false);
        } else if (event.data.status === "PAUSED") {
          setIsPlaying(false);
        }
      }
    };
    window.addEventListener("message", handleFrameMessage);

    // 4. Sentuhan / gesture pertama di mana saja pada layar langsung melakukan unmute
    let hasUnmuted = false;

    const interactionEvents = [
      "click",
      "touchstart",
      "touchend",
      "pointerdown",
      "pointerup",
      "mousedown",
      "mouseup",
      "keydown",
      "scroll",
      "wheel",
    ];

    const removeListeners = () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction, true);
        document.removeEventListener(evt, handleInteraction, true);
      });
    };

    const handleInteraction = () => {
      if (hasUnmuted) return;
      hasUnmuted = true;

      unmuteWithFadeIn();
      removeListeners();
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleInteraction, { capture: true, passive: true });
    });

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__unmuteMusic;
        delete (window as any).__triggerPlayMusic;
      }
      window.removeEventListener("message", handleFrameMessage);
      removeListeners();
    };
  }, [unmuteWithFadeIn]);

  const isSoundActive = isPlaying && !isMuted;

  return (
    <>
      {/* ── Iframe Autoplay Delegation (Permissions Policy: allow="autoplay") ── */}
      <iframe
        ref={iframeRef}
        src="/audio-frame.html"
        allow="autoplay; fullscreen"
        title="Background Audio Player"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
          border: "none",
          clip: "rect(0, 0, 0, 0)",
        }}
      />

      {/* ── HTML5 Audio Element Fallback (Muted Autoplay) ── */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Music Control Button */}
      <button
        id="music-play-btn"
        ref={buttonRef}
        type="button"
        onClick={togglePlay}
        aria-label={isSoundActive ? "Pause music" : "Play music"}
        title={isSoundActive ? "Pause Background Music" : "Play Background Music"}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 999,
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          backgroundColor: isSoundActive
            ? "rgba(30, 20, 15, 0.55)"
            : "rgba(30, 20, 15, 0.35)",
          border: isSoundActive
            ? "1px solid rgba(255, 235, 205, 0.5)"
            : "1px solid rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: isSoundActive
            ? "0 4px 16px rgba(0, 0, 0, 0.35), 0 0 12px rgba(220, 175, 140, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.25)",
          color: "rgba(255, 245, 230, 0.95)",
          padding: 0,
          transition: "transform 0.25s ease, background-color 0.25s ease",
          outline: "none",
        }}
      >
        <motion.div
          animate={isSoundActive ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isSoundActive
              ? { repeat: Infinity, duration: 4, ease: "linear" }
              : { duration: 0.25 }
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {isSoundActive ? (
            /* Musical note */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.4" />
              <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.4" />
            </svg>
          ) : (
            /* Muted music note */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.8 }}
            >
              <line x1="2" y1="2" x2="22" y2="22" stroke="rgba(255, 120, 120, 0.95)" strokeWidth="2.2" />
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </motion.div>
      </button>
    </>
  );
}
