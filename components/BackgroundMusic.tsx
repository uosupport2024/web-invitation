"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const PRIMARY_AUDIO_SRC = "/backsound/backsound.mp3";
const FALLBACK_AUDIO_SRC = "/backsound/Littleroot%20Town%20Theme%20-%20Classical%20Guitar%20Cover.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.65;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBlocked(false);
        })
        .catch((err) => {
          // Browser prevented autoplay without user interaction
          console.info("Autoplay requires user gesture:", err?.message || err);
          setIsPlaying(false);
          setIsBlocked(true);
        });
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 1. Attempt immediate playback on mount
    startPlayback();

    // 2. Also attempt playback when audio buffer is ready
    const handleCanPlay = () => {
      if (audio.paused) {
        startPlayback();
      }
    };
    audio.addEventListener("canplay", handleCanPlay);

    // 3. Capture-phase listener for ANY initial user interaction across the entire window
    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        startPlayback();
      }
    };

    const interactionEvents = [
      "click",
      "pointerdown",
      "touchstart",
      "touchend",
      "mousedown",
      "keydown",
      "scroll",
      "wheel",
    ];

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleInteraction, { capture: true, passive: true });
    });

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction, { capture: true });
        document.removeEventListener(evt, handleInteraction, { capture: true });
      });
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
      startPlayback();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        loop
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setIsBlocked(false);
        }}
        onPause={() => setIsPlaying(false)}
      >
        <source src={PRIMARY_AUDIO_SRC} type="audio/mpeg" />
        <source src={FALLBACK_AUDIO_SRC} type="audio/mpeg" />
      </audio>

      {/* Floating Music Control in Top-Right Corner */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 70,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Subtle helper pill if browser autoplay policy blocks unmuted audio */}
        <AnimatePresence>
          {isBlocked && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              onClick={togglePlay}
              style={{
                cursor: "pointer",
                background: "rgba(30, 20, 15, 0.65)",
                border: "1px solid rgba(255, 235, 200, 0.4)",
                borderRadius: "20px",
                padding: "6px 12px",
                color: "rgba(255, 245, 230, 0.95)",
                fontSize: "0.72rem",
                letterSpacing: "0.05em",
                fontFamily: "system-ui, -apple-system, sans-serif",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              🎵 Tap to play music
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          title={isPlaying ? "Pause Background Music" : "Play Background Music"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: isBlocked && !isPlaying ? [1, 1.08, 1] : 1,
          }}
          transition={
            isBlocked && !isPlaying
              ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
              : { duration: 0.5, delay: 0.2 }
          }
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: isPlaying
              ? "rgba(30, 20, 15, 0.5)"
              : "rgba(30, 20, 15, 0.35)",
            border: isPlaying
              ? "1px solid rgba(255, 235, 205, 0.45)"
              : isBlocked
              ? "1px solid rgba(235, 180, 120, 0.65)"
              : "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: isPlaying
              ? "0 2px 10px rgba(0, 0, 0, 0.35), 0 0 12px rgba(220, 175, 140, 0.25)"
              : isBlocked
              ? "0 0 12px rgba(235, 180, 120, 0.5)"
              : "0 2px 10px rgba(0, 0, 0, 0.3)",
            color: "rgba(255, 245, 230, 0.95)",
            padding: 0,
          }}
        >
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying
                ? { repeat: Infinity, duration: 4.5, ease: "linear" }
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
              <svg
                width="17"
                height="17"
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
              <svg
                width="17"
                height="17"
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
        </motion.button>
      </div>
    </>
  );
}
