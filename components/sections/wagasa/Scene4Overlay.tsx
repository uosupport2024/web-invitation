"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { SceneState } from "./types";

interface Scene4OverlayProps {
  scene: SceneState;
  onOpen?: () => void;
}

export function Scene4Overlay({ scene, onOpen }: Scene4OverlayProps) {
  return (
    <>
      {/* Scene 4 Header Text Image Asset (Revised Title) */}
      <AnimatePresence>
        {scene === "scene4" && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "absolute",
              top: "12%",
              left: 0,
              right: 0,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {/* Revised Title Image */}
            <div style={{ position: "relative", width: "65%", aspectRatio: "519 / 277" }}>
              <Image
                src="/images/theojess_revisedtitle.png"
                alt="Theodore & Jesslyn"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 4 Button Image Asset (theojesslyn_button.png) */}
      <AnimatePresence>
        {scene === "scene4" && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "absolute",
              bottom: "11%",
              left: 0,
              right: 0,
              zIndex: 20,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              onClick={() => {
                if (typeof window !== "undefined") {
                  (window as any).__unmuteMusic?.();
                }
                onOpen?.();
              }}
              style={{
                position: "relative",
                width: "34%",
                aspectRatio: "228 / 91",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <Image
                src="/images/theojesslyn_startbutton.png"
                alt="Welcome Button"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
