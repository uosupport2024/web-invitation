"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SceneState } from "./types";
import { wagasas } from "./config";

interface WagasaUmbrellasProps {
  scene: SceneState;
}

export function WagasaUmbrellas({ scene }: WagasaUmbrellasProps) {
  return (
    <>
      {wagasas.map((w, i) => {
        const c = w.closed;
        const o = w.open;
        return (
          <motion.div
            key={i}
            style={{ position: "absolute", aspectRatio: "1", zIndex: w.z }}
            animate={
              scene === "scene2"
                ? {
                  top: `${(o.top / 677) * 100}%`,
                  left: `${(o.left / 375) * 100}%`,
                  width: `${(o.size / 375) * 100}%`,
                  opacity: 1,
                }
                : scene === "scene3" || scene === "scene4"
                ? {
                  top: `${(o.top / 677) * 100}%`,
                  left: `${(o.left / 375) * 100}%`,
                  width: `${(o.size / 375) * 100}%`,
                  opacity: 0,
                }
                : {
                  top: `${(c.top / 677) * 100}%`,
                  left: `${(c.left / 375) * 100}%`,
                  width: `${(c.size / 375) * 100}%`,
                  opacity: 1,
                }
            }
            initial={{
              top: `${(c.top / 677) * 100}%`,
              left: `${(c.left / 375) * 100}%`,
              width: `${(c.size / 375) * 100}%`,
              opacity: 1,
            }}
            transition={
              scene === "scene2"
                ? {
                  duration: 2.8,
                  delay: w.exitDelay,
                  ease: [0.33, 1, 0.68, 1],
                }
                : scene === "scene3" || scene === "scene4"
                ? {
                  duration: 1.0,
                  delay: w.exitDelay * 0.5,
                  ease: "easeOut",
                }
                : { duration: 0.5 }
            }
          >
            {/* Swaying & Wind-Drifting Umbrella Graphic */}
            <motion.div
              style={{ position: "relative", width: "100%", height: "100%" }}
              animate={{
                rotate: [0, w.swayAngle, 0],
                x: [0, w.driftX, 0],
                y: [0, w.driftY, 0],
              }}
              transition={{
                duration: w.swayDuration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image src={w.src} alt="" fill className="object-contain" sizes="100vw" priority />
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}
