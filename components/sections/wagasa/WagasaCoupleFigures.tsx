"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SceneState } from "./types";

interface WagasaCoupleFiguresProps {
  scene: SceneState;
  isExiting: boolean;
}

export function WagasaCoupleFigures({ scene, isExiting }: WagasaCoupleFiguresProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.65, y: 15 }}
      animate={
        scene === "scene4"
          ? { opacity: 1, scale: 0.50, x: 0, y: 48 }
          : isExiting
          ? { opacity: 1, scale: 0.90, x: -8, y: 34 }
          : { opacity: 0, scale: 0.80, x: -8, y: 45 }
      }
      transition={{
        duration: 2.0,
        delay: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: scene === "scene4" ? 4 : 0,
        pointerEvents: "none",
      }}
    >
      {/* Theo (Groom - Left) */}
      <div
        style={{
          position: "absolute",
          left: "3%",
          top: `${(210 / 677) * 100}%`,
          width: "55%",
          height: "65.48%",
          transform: "scaleX(-1)",
        }}
      >
        <Image
          src="/images/theojesslyn_theo.png"
          alt="Theo"
          fill
          className="object-contain object-top"
          sizes="60vw"
          priority
        />
      </div>

      {/* Jesslyn (Bride - Right) */}
      <div
        style={{
          position: "absolute",
          left: `${(175 / 375) * 100}%`,
          top: `${(300 / 677) * 100}%`,
          width: `${(170 / 375) * 100}%`,
          height: `${(375 / 677) * 100}%`,
        }}
      >
        <Image
          src="/images/theojesslyn_jesslyn.png"
          alt="Jesslyn"
          fill
          className="object-contain object-top"
          sizes="40vw"
          priority
        />
      </div>
    </motion.div>
  );
}
