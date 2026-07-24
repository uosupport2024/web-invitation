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

type SceneState = "scene1" | "scene2" | "scene3" | "scene4";

interface WagasaSectionProps {
  onOpen?: () => void;
}

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

    // Transisi ke halaman selanjutnya (~6.5s total)
    setTimeout(() => {
      onOpen?.();
    }, 6500);
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
      {/* Background — transisi ke warna #DBAF8C saat terbuka */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        animate={{
          background: isExiting ? "#DBAF8C" : "#c4a06a",
        }}
        transition={{ duration: 2.0, ease: "easeInOut" }}
      />

      {/* Triple Cloud Background Layers — 900x1600 full canvas layering */}
      {/* Layer 1 (Awan Bawah): trippleawan-02.png */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scene === "scene4" ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
      >
        <Image
          src="/images/theojesslyn_trippleawan-02.png"
          alt=""
          fill
          className="object-fill"
          sizes="100vw"
          priority
        />
      </motion.div>

      {/* Layer 2 (Awan Tengah): trippleawan-01.png */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scene === "scene4" ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.15, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
      >
        <Image
          src="/images/theojesslyn_trippleawan-01.png"
          alt=""
          fill
          className="object-fill"
          sizes="100vw"
          priority
        />
      </motion.div>

      {/* Layer 3 (Awan Atas Overlay): trippleawan-03.png */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scene === "scene4" ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
      >
        <Image
          src="/images/theojesslyn_trippleawan-03.png"
          alt=""
          fill
          className="object-fill"
          sizes="100vw"
          priority
        />
      </motion.div>

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
        {/* Scene 4 Header Text Image Assets (The Wedding Of & Theodore & Jesslyn) */}
        <AnimatePresence>
          {scene === "scene4" && (
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: "absolute",
                top: "14%",
                left: 0,
                right: 0,
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                pointerEvents: "none",
              }}
            >
              {/* THE WEDDING OF Image */}
              <div style={{ position: "relative", width: "42%", aspectRatio: "289 / 35" }}>
                <Image
                  src="/images/theojesslyn_theweddingof.png"
                  alt="The Wedding Of"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* THEODORE & JESSLYN Name Image */}
              <div style={{ position: "relative", width: "75%", aspectRatio: "660 / 67" }}>
                <Image
                  src="/images/theojesslyn_namebuatcover.png"
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
                zIndex: 10,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ position: "relative", width: "34%", aspectRatio: "228 / 91" }}>
                <Image
                  src="/images/theojesslyn_button.png"
                  alt="Welcome Button"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Couple Figures (Theo & Jesslyn) — diletakkan di bawah payung (zIndex: 0 di Step 2) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.65, y: 15 }}
          animate={
            scene === "scene4"
              ? { opacity: 1, scale: 0.50, y: 35 }
              : isExiting
              ? { opacity: 1, scale: 0.70, y: 0 }
              : { opacity: 0, scale: 0.65, y: 15 }
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

        {/* 8 Wagasa Umbrellas:
            - Step 1 (scene1): Positions closed (Image 1)
            - Step 2 (scene2): Positions open (Image 2), framing screen for ~3.5s
            - Step 3 & 4 (scene3/4): Payung semua menghilang (opacity: 0)
        */}
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
      </motion.div>
    </section>
  );
}

