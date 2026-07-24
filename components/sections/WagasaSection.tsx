"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { SceneState, WagasaSectionProps } from "./wagasa/types";
import { TripleCloudBackground } from "./wagasa/TripleCloudBackground";
import { WagasaCoupleFigures } from "./wagasa/WagasaCoupleFigures";
import { WagasaUmbrellas } from "./wagasa/WagasaUmbrellas";
import { Scene4Overlay } from "./wagasa/Scene4Overlay";

export function WagasaSection({ onOpen }: WagasaSectionProps) {
  const [scene, setScene] = useState<SceneState>("scene1");

  const handleClick = () => {
    if (scene !== "scene1") return;
    navigator.vibrate?.(30);

    // Step 2 (Image 2): Payung mekar ke bingkai pinggir layar, bertahan ~3.5 detik
    setScene("scene2");

    // Step 3: Semua payung menghilang (opacity: 0), figur bertahan selama 1 detik
    setTimeout(() => {
      setScene("scene3");
    }, 3500);

    // Step 4 (Scene 4): Kamera melakukan slow zoom out selama ~2 detik
    setTimeout(() => {
      setScene("scene4");
    }, 4500);
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
        cursor: scene === "scene1" ? "pointer" : "default",
      }}
    >
        {/* Background base color & 3-layer cloud animations */}
        <TripleCloudBackground scene={scene} isExiting={isExiting} />

        {/* Main container wrapper — Step 4 Camera Slow Zoom Out & Layout */}
        <motion.div
          style={{ position: "relative", width: "100%", height: "100%", zIndex: 4 }}
          animate={
            scene === "scene4"
              ? { scale: 0.88, opacity: 1 }
              : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: 2.0,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {/* Header title images & button image for Scene 4 */}
          <Scene4Overlay scene={scene} onOpen={onOpen} />

          {/* Theo & Jesslyn couple figures */}
          <WagasaCoupleFigures scene={scene} isExiting={isExiting} />

          {/* 8 Wagasa umbrellas with sway & wind drift */}
          <WagasaUmbrellas scene={scene} />
        </motion.div>
    </section>
  );
}
