"use client";

import { motion } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { SceneState, WagasaSectionProps } from "./wagasa/types";
import { TripleCloudBackground } from "./wagasa/TripleCloudBackground";
import { WagasaCoupleFigures } from "./wagasa/WagasaCoupleFigures";
import { WagasaUmbrellas } from "./wagasa/WagasaUmbrellas";
import { Scene4Overlay } from "./wagasa/Scene4Overlay";

export function WagasaSection({ onOpen }: WagasaSectionProps) {
  const [scene, setScene] = useState<SceneState>("scene1");
  const startSequence = useCallback((isUserGesture = false) => {
    // Bersamaan dengan payung membuka, jalankan unmute musik di luar render cycle
    if (typeof window !== "undefined") {
      setTimeout(() => {
        (window as any).__unmuteMusic?.();
      }, 0);
    }

    setScene((prev) => {
      if (prev !== "scene1") return prev;

      if (isUserGesture && typeof navigator !== "undefined" && navigator.userActivation?.hasBeenActive) {
        try {
          navigator.vibrate?.(30);
        } catch {
          // Ignore vibration intervention
        }
      }

      // Step 2 (Image 2): Payung mekar ke bingkai pinggir layar, bertahan ~3.5 detik
      // Step 3: Semua payung menghilang (opacity: 0), figur bertahan selama 1 detik
      setTimeout(() => {
        setScene("scene3");
      }, 3500);

      // Step 4 (Scene 4): Kamera melakukan slow zoom out selama ~2 detik
      setTimeout(() => {
        setScene("scene4");
      }, 4500);

      return "scene2";
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      startSequence(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [startSequence]);

  const handleClick = () => {
    if (typeof window !== "undefined") {
      (window as any).__unmuteMusic?.();
    }
    startSequence(true);
  };

  const isExiting = scene !== "scene1";

  return (
    <section
      onClick={handleClick}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#DBAF8C",
        cursor: scene === "scene1" ? "pointer" : "default",
      }}
    >
      {/* Background base color & 3-layer cloud animations */}
      <TripleCloudBackground scene={scene} isExiting={isExiting} />

      {/* Header title images & button image for Scene 4 */}
      <Scene4Overlay scene={scene} onOpen={onOpen} />

      {/* Theo & Jesslyn couple figures */}
      <WagasaCoupleFigures scene={scene} isExiting={isExiting} />

      {/* 8 Wagasa umbrellas with sway & wind drift */}
      <WagasaUmbrellas scene={scene} />
    </section>
  );
}
