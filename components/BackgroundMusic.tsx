"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";

const AUDIO_SRC = "/backsound/backsound.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.65;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy without user gesture yet
          setIsPlaying(false);
        });
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 1. Coba autoplay langsung saat mount
    startPlayback();

    // 2. Coba play saat buffer audio siap
    const handleCanPlay = () => {
      if (audio.paused) {
        startPlayback();
      }
    };
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("loadeddata", handleCanPlay);

    // 3. Fallback interaksi pengguna:
    // PENTING: Jangan hapus listener sebelum audio BENAR-BENAR berhasil diputar!
    let hasStarted = false;

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
      if (hasStarted || !audioRef.current) return;

      audioRef.current.volume = 0.65;
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            hasStarted = true;
            setIsPlaying(true);
            // HANYA hapus listener setelah pemutaran audio benar-benar BERHASIL!
            removeListeners();
          })
          .catch(() => {
            // Jika gesture belum diizinkan oleh browser (misal pointerdown),
            // listener tetap aktif menunggu event click/touchend berikutnya!
          });
      }
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleInteraction, { capture: true, passive: true });
    });

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("loadeddata", handleCanPlay);
      removeListeners();
    };
  }, [startPlayback]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        autoPlay
        playsInline
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Music Control Button */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause Background Music" : "Play Background Music"}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 999,
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          backgroundColor: isPlaying
            ? "rgba(30, 20, 15, 0.55)"
            : "rgba(30, 20, 15, 0.35)",
          border: isPlaying
            ? "1px solid rgba(255, 235, 205, 0.5)"
            : "1px solid rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: isPlaying
            ? "0 4px 16px rgba(0, 0, 0, 0.35), 0 0 12px rgba(220, 175, 140, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.25)",
          color: "rgba(255, 245, 230, 0.95)",
          padding: 0,
          transition: "transform 0.25s ease, background-color 0.25s ease",
          outline: "none",
        }}
      >
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
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
          {isPlaying ? (
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
