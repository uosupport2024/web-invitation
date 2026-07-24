"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

// 8 Wagasa umbrellas with closed (center cluster) & open (frame border) positions + sway wind drift
const wagasas = [
  // 1. Top-Left: Umbrella #1 (Light Beige)
  {
    src: "/images/theojesslyn_umbrella02.png",
    z: 5,
    swayAngle: -8,
    driftX: -8,
    driftY: 4,
    swayDuration: 3.6,
    exitDelay: 0.15,
    closed: { top: -153, left: -93, size: 279 },
    open: { top: -190, left: -120, size: 300 },
  },
  // 2. Top-Right: Umbrella #2 (Terracotta / Orange)
  {
    src: "/images/theojesslyn_umbrella03.png",
    z: 4,
    swayAngle: 10,
    driftX: 10,
    driftY: -5,
    swayDuration: 3.5,
    exitDelay: 0.1,
    closed: { top: -154, left: 105, size: 354 },
    open: { top: -92, left: 240, size: 360 },
  },
  // 3. Upper-Mid Left: Umbrella #3 (Medium Brown)
  {
    src: "/images/theojesslyn_umbrella01.png",
    z: 3,
    swayAngle: 12,
    driftX: 12,
    driftY: 5,
    swayDuration: 4.1,
    exitDelay: 0.0,
    closed: { top: 59, left: -58, size: 281 },
    open: { top: 15, left: -145, size: 281 },
  },
  // 4. Mid-Right: Umbrella #1 (Light Beige)
  {
    src: "/images/theojesslyn_umbrella02.png",
    z: 5,
    swayAngle: -10,
    driftX: -9,
    driftY: -4,
    swayDuration: 4.0,
    exitDelay: 0.05,
    closed: { top: 70, left: 173, size: 279 },
    open: { top: 148, left: 244, size: 279 },
  },
  // 5. Lower-Mid Left: Umbrella #1 (Light Beige)
  {
    src: "/images/theojesslyn_umbrella02.png",
    z: 6,
    swayAngle: -9,
    driftX: -7,
    driftY: 6,
    swayDuration: 3.8,
    exitDelay: 0.25,
    closed: { top: 290, left: -78, size: 279 },
    open: { top: 553, left: -124, size: 290 },
  },
  // 6. Lower-Mid Right: Umbrella #3 (Medium Brown)
  {
    src: "/images/theojesslyn_umbrella01.png",
    z: 4,
    swayAngle: 8,
    driftX: 8,
    driftY: -3,
    swayDuration: 3.7,
    exitDelay: 0.2,
    closed: { top: 256, left: 91, size: 334 },
    open: { top: 256, left: 600, size: 334 },
  },
  // 7. Bottom-Left: Umbrella #2 (Terracotta / Orange)
  {
    src: "/images/theojesslyn_umbrella03.png",
    z: 1,
    swayAngle: -12,
    driftX: -11,
    driftY: -6,
    swayDuration: 4.2,
    exitDelay: 0.4,
    closed: { top: 463, left: -31, size: 294 },
    open: { top: 600, left: 65, size: 294 },
  },
  // 8. Bottom-Right: Umbrella #1 (Light Beige)
  {
    src: "/images/theojesslyn_umbrella02.png",
    z: 7,
    swayAngle: 9,
    driftX: 9,
    driftY: 4,
    swayDuration: 3.9,
    exitDelay: 0.35,
    closed: { top: 437, left: 155, size: 279 },
    open: { top: 558, left: 269, size: 279 },
  },
];

type SceneState = "scene1" | "scene2" | "scene3";

interface WagasaSectionProps {
  onOpen?: () => void;
}

export function WagasaSection({ onOpen }: WagasaSectionProps) {
  const [scene, setScene] = useState<SceneState>("scene1");

  const handleClick = () => {
    if (scene !== "scene1") return;
    navigator.vibrate?.(30);

    // Scene 2 (~3-5s): Payung-payung mengembang mekar ke pinggir layar secara berurutan
    setScene("scene2");

    // Scene 3 (~1s): Pause dengan pasangan terungkap jelas di tengah & payung membingkai pinggir layar
    setTimeout(() => {
      setScene("scene3");
    }, 3500);

    // Trigger transisi akhir (~4.5s total)
    setTimeout(() => {
      onOpen?.();
    }, 4500);
  };

  const isExiting = scene !== "scene1";

  return (
    <section
      onClick={handleClick}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "375 / 677",
        overflow: "hidden",
        cursor: scene === "scene1" ? "pointer" : "default",
      }}
    >
      {/* Background — transisi dari warm tan → cream ivory saat terbuka */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        animate={{
          background: isExiting
            ? "linear-gradient(160deg, #f5ede0 0%, #ede0c8 40%, #f0e4cc 100%)"
            : "linear-gradient(145deg, #c4a06a 0%, #b8956a 30%, #cba97a 60%, #c49a68 100%)",
        }}
        transition={{ duration: 3.0, ease: "easeInOut" }}
      />

      {/* Main container wrapper */}
      <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
        {/* Couple Figures (Theo & Jesslyn) — diletakkan di bawah payung (zIndex: 0) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={
            isExiting
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.94, y: 15 }
          }
          transition={{
            duration: 2.2,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {/* Theo (Groom - Left) — Shifted 5% right, sized +10%, Flipped Horizontal */}
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

          {/* Jesslyn (Bride - Right) — Shifted slightly right */}
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

        {/* 8 Wagasa Umbrellas — mekar ke bingkai pinggir layar (tetap kelihatan memelihara estetika Image 2) */}
        {wagasas.map((w, i) => {
          const c = w.closed;
          const o = w.open;
          return (
            <motion.div
              key={i}
              style={{ position: "absolute", aspectRatio: "1", zIndex: w.z }}
              animate={
                isExiting
                  ? {
                    top: `${(o.top / 677) * 100}%`,
                    left: `${(o.left / 375) * 100}%`,
                    width: `${(o.size / 375) * 100}%`,
                    opacity: 1,
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
                isExiting
                  ? {
                    duration: 3.0,
                    delay: w.exitDelay,
                    ease: [0.33, 1, 0.68, 1],
                  }
                  : { duration: 0.5 }
              }
            >
              {/* Swaying & Wind-Drifting Umbrella Graphic (Tetap bergoyang lembut) */}
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
      </div>

      {/* Hint tap — hanya di Scene 1 */}
      <AnimatePresence>
        {scene === "scene1" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{
              position: "absolute",
              bottom: "6%",
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              pointerEvents: "none",
            }}
          >
            <span style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.9)",
              fontFamily: "serif",
              letterSpacing: "0.14em",
              textShadow: "0 1px 6px rgba(0,0,0,0.35)",
            }}>
              Sentuh untuk membuka
            </span>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.8)" }}>↓</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

