"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { wagasas } from "./wagasa/config";
import { TripleCloudBackground } from "./wagasa/TripleCloudBackground";
import { WagasaCoupleFigures } from "./wagasa/WagasaCoupleFigures";

interface WagasaClosingSectionProps {
  isActive: boolean;
  onBack?: () => void;
}

export function WagasaClosingSection({ isActive, onBack }: WagasaClosingSectionProps) {
  // isClosed becomes true to trigger the closing animation from open -> closed
  const [isClosing, setIsClosing] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (isActive) {
      // Immediately trigger the reverse closing animation
      const timer = setTimeout(() => {
        setIsClosing(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsClosing(false);
    }
  }, [isActive]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive || !onBack) return;
    const touchEndY = e.touches[0].clientY;
    const diffY = touchStartY.current - touchEndY;
    // Swipe down to go back to accommodation
    if (diffY < -50) {
      onBack();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isActive || !onBack) return;
    if (e.deltaY < -15) {
      onBack();
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onWheel={handleWheel}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 150, // Above AccommodationSection (100)
            overflow: "hidden",
            width: "100%",
            height: "100dvh",
            backgroundColor: "#DBAF8C",
          }}
        >
          {/* Background & Cloud Layers (Scene 1 scale) */}
          <TripleCloudBackground scene="scene1" isExiting={!isClosing} />

          {/* Couple Figures (Theo & Jesslyn) — naturally covered as umbrellas close */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <WagasaCoupleFigures scene="scene2" isExiting={true} />
          </motion.div>

          {/* 8 Wagasa Umbrellas — starting at open borders, smoothly closing to center cluster */}
          {wagasas.map((w, i) => {
            const c = w.closed;
            const o = w.open;
            return (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  aspectRatio: "1",
                  zIndex: 10 + w.z,
                  pointerEvents: "none",
                }}
                initial={{
                  top: `${(o.top / 677) * 100}%`,
                  left: `${(o.left / 375) * 100}%`,
                  width: `${(o.size / 375) * 100}%`,
                  x: "0vw",
                  opacity: 1,
                }}
                animate={
                  isClosing
                    ? {
                        top: `${(c.top / 677) * 100}%`,
                        left: `${(c.left / 375) * 100}%`,
                        width: `${(c.size / 375) * 100}%`,
                        x: "0vw",
                        opacity: 1,
                      }
                    : {
                        top: `${(o.top / 677) * 100}%`,
                        left: `${(o.left / 375) * 100}%`,
                        width: `${(o.size / 375) * 100}%`,
                        x: "0vw",
                        opacity: 1,
                      }
                }
                transition={{
                  duration: 2.6,
                  delay: (0.4 - w.exitDelay) * 0.45,
                  ease: [0.25, 1, 0.5, 1],
                }}
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
                  <Image
                    src={w.src}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {/* ── Ambient Falling Leaves (GPU CSS Animation) ── */}
          <style jsx>{`
            @keyframes closingLeafFall {
              0% {
                transform: translate3d(0, -15vh, 0) rotate(0deg);
                opacity: 0;
              }
              12% {
                opacity: 0.85;
              }
              80% {
                opacity: 0.85;
              }
              100% {
                transform: translate3d(var(--drift-x), 115vh, 0) rotate(var(--drift-rot));
                opacity: 0;
              }
            }
            .closing-ambient-leaf {
              position: absolute;
              top: 0;
              will-change: transform;
              animation: closingLeafFall var(--fall-dur) ease-in-out var(--fall-delay) forwards;
              pointer-events: none;
              backface-visibility: hidden;
            }
          `}</style>
          {isClosing &&
            [
              { src: "/images/theojesslyn_mapleleaf_terbang01.png", left: "14%", size: 34, delay: "0.6s", dur: "4.5s", driftX: "40px", rot: "180deg" },
              { src: "/images/theojesslyn_mapleleaf_terbang02.png", left: "45%", size: 26, delay: "1.0s", dur: "5.0s", driftX: "-35px", rot: "-220deg" },
              { src: "/images/theojesslyn_mapleleaf_terbang01.png", left: "78%", size: 30, delay: "1.4s", dur: "4.6s", driftX: "45px", rot: "240deg" },
              { src: "/images/theojesslyn_mapleleaf_terbang02.png", left: "26%", size: 24, delay: "1.9s", dur: "4.8s", driftX: "-30px", rot: "-190deg" },
              { src: "/images/theojesslyn_mapleleaf_terbang01.png", left: "85%", size: 28, delay: "2.3s", dur: "4.4s", driftX: "35px", rot: "200deg" },
            ].map((leaf, idx) => (
              <div
                key={`ambient-leaf-${idx}`}
                className="closing-ambient-leaf"
                style={{
                  left: leaf.left,
                  width: `${leaf.size}px`,
                  height: `${leaf.size}px`,
                  zIndex: 25,
                  ["--fall-dur" as string]: leaf.dur,
                  ["--fall-delay" as string]: leaf.delay,
                  ["--drift-x" as string]: leaf.driftX,
                  ["--drift-rot" as string]: leaf.rot,
                }}
              >
                <img
                  src={leaf.src}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
              </div>
            ))}

          {/* ── Leaves Falling from Top to Bottom & Settling to Gambar 2 End State ── */}
          {/* Leaf 1: Dark Leaf — Top Right (theojesslyn_leafbackgroundterbang.png) */}
          <motion.div
            initial={{ y: "-110vh", opacity: 0 }}
            animate={isClosing ? { y: "0vh", opacity: 1 } : { y: "-110vh", opacity: 0 }}
            transition={{
              y: { duration: 2.6, delay: 1.1, ease: [0.18, 0.9, 0.32, 1] },
              opacity: { duration: 0.3, delay: 1.1 },
            }}
            style={{
              position: "absolute",
              top: "0%",
              right: "-5%",
              width: "60%",
              aspectRatio: "477 / 518",
              zIndex: 30,
              pointerEvents: "none",
              willChange: "transform",
            }}
          >
            <motion.div
              initial={{ x: -35, rotate: -35, scale: 0.75 }}
              animate={
                isClosing
                  ? {
                      x: [-35, 30, -18, 10, 0],
                      rotate: [-35, 22, -12, 12, 8],
                      scale: [0.75, 0.88, 1.03, 0.98, 1],
                    }
                  : { x: -35, rotate: -35, scale: 0.75 }
              }
              transition={{
                duration: 2.6,
                delay: 1.1,
                ease: "easeInOut",
                times: [0, 0.35, 0.65, 0.88, 1],
              }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <Image
                src="/images/theojesslyn_leafbackgroundterbang.png"
                alt=""
                fill
                className="object-contain"
                sizes="60vw"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Leaf 2: Dark Leaf — Bottom Left (theojesslyn_leafbackgroundterbang.png, flipped) */}
          <motion.div
            initial={{ y: "-115vh", opacity: 0 }}
            animate={isClosing ? { y: "0vh", opacity: 1 } : { y: "-115vh", opacity: 0 }}
            transition={{
              y: { duration: 2.7, delay: 1.5, ease: [0.18, 0.9, 0.32, 1] },
              opacity: { duration: 0.3, delay: 1.5 },
            }}
            style={{
              position: "absolute",
              top: "66%",
              left: "-6%",
              width: "50%",
              aspectRatio: "477 / 518",
              zIndex: 30,
              pointerEvents: "none",
              willChange: "transform",
            }}
          >
            <motion.div
              initial={{ x: 35, rotate: 35, scale: 0.72 }}
              animate={
                isClosing
                  ? {
                      x: [35, -30, 20, -10, 0],
                      rotate: [35, -24, 15, -18, -15],
                      scale: [0.72, 0.86, 1.03, 0.98, 1],
                    }
                  : { x: 35, rotate: 35, scale: 0.72 }
              }
              transition={{
                duration: 2.7,
                delay: 1.5,
                ease: "easeInOut",
                times: [0, 0.35, 0.65, 0.88, 1],
              }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transform: "scaleX(-1)",
                }}
              >
                <Image
                  src="/images/theojesslyn_leafbackgroundterbang.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="50vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Leaf 3: Main Leaf With Text — Center (theojesslyn_leafwithtext.png) */}
          <motion.div
            initial={{ y: "-115vh", opacity: 0 }}
            animate={isClosing ? { y: "0vh", opacity: 1 } : { y: "-115vh", opacity: 0 }}
            transition={{
              y: { duration: 2.8, delay: 2.1, ease: [0.18, 0.9, 0.32, 1] },
              opacity: { duration: 0.3, delay: 2.1 },
            }}
            style={{
              position: "absolute",
              top: "22%",
              left: "-6%",
              width: "106%",
              aspectRatio: "994 / 1044",
              zIndex: 35,
              pointerEvents: "none",
              willChange: "transform",
            }}
          >
            <motion.div
              initial={{ x: -40, rotate: -24, scale: 0.7 }}
              animate={
                isClosing
                  ? {
                      x: [-40, 35, -22, 10, 0],
                      rotate: [-24, 16, -10, 4, 0],
                      scale: [0.7, 0.85, 1.03, 0.98, 1],
                    }
                  : { x: -40, rotate: -24, scale: 0.7 }
              }
              transition={{
                duration: 2.8,
                delay: 2.1,
                ease: "easeInOut",
                times: [0, 0.35, 0.65, 0.88, 1],
              }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <Image
                src="/images/theojesslyn_leafwithtext.png"
                alt="Can't wait to see you in Kyoto"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Soft Back Button on Top Left */}
          {onBack && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                onBack();
              }}
              style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                zIndex: 200,
                background: "rgba(30, 20, 15, 0.45)",
                border: "1px solid rgba(255, 245, 230, 0.35)",
                borderRadius: "20px",
                padding: "6px 14px 6px 10px",
                color: "rgba(255, 245, 230, 0.95)",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.6)",
              }}
              whileHover={{ scale: 1.04, backgroundColor: "rgba(30, 20, 15, 0.65)" }}
              whileTap={{ scale: 0.96 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19L8 12L15 5"
                  stroke="rgba(255, 245, 230, 0.95)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Back</span>
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
