"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface AccommodationSectionProps {
  isActive: boolean;
  onClose: () => void;
}

export function AccommodationSection({ isActive, onClose }: AccommodationSectionProps) {
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive) return;
    const touchEndY = e.touches[0].clientY;
    const diffY = touchStartY.current - touchEndY;
    // Swipe down (user swiping downwards to scroll up/back)
    if (diffY < -50) {
      onClose();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isActive) return;
    // Scroll wheel up (deltaY is negative) to return
    if (e.deltaY < -15) {
      onClose();
    }
  };

  // Text fadeInUp variant
  const textVariant = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: {
      duration: 1.0,
      delay,
      ease: [0.25, 1, 0.5, 1],
    },
  });

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isActive ? "0%" : "100%" }}
      exit={{ y: "100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100, // Topmost layer
        overflow: "hidden",
        width: "100%",
        height: "100dvh",
        background: "#61291A", // Fallback color
      }}
    >
      {/* ── Background Image ── */}
      <Image
        src="/images/theojesslyn_bgaccomms.png"
        alt="Accommodation Background"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* ── Left Lantern (lantern02) ── */}
      <motion.div
        style={{
          position: "absolute",
          top: "0%",
          left: "-0%",
          width: "60%",
          aspectRatio: "367 / 800", // Maintain aspect ratio
          transformOrigin: "50% 0%",
          pointerEvents: "none",
          zIndex: 10,
        }}
        animate={{
          rotate: [0, 0.5, -0.4, 0.3, -0.3, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/theojesslyn_lantern02.png"
          alt="Left Lantern"
          fill
          className="object-contain object-top"
          sizes="50vw"
        />
      </motion.div>

      {/* ── Right Lantern (lantern01) ── */}
      <motion.div
        style={{
          position: "absolute",
          top: "0%",
          right: "-12%",
          width: "85%",
          aspectRatio: "374 / 800",
          transformOrigin: "50% 0%",
          pointerEvents: "none",
          zIndex: 10,
        }}
        animate={{
          rotate: [0, -0.4, 0.5, -0.3, 0.3, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Image
          src="/images/theojesslyn_lantern01.png"
          alt="Right Lantern"
          fill
          className="object-contain object-top"
          sizes="50vw"
        />
      </motion.div>

      {/* ── Left Hanging Origami Crane (bird02) ── */}
      <motion.div
        style={{
          position: "absolute",
          top: "-2%",
          left: "10%",
          width: "58%",
          aspectRatio: "647 / 1005",
          transformOrigin: "50% 0%",
          pointerEvents: "none",
          zIndex: 15,
        }}
        animate={{
          x: [0, 5, -5, 3, -3, 0],
          rotate: [0, 2, -2, 1, -1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/theojesslyn_bird02.png"
          alt="Origami Crane Left"
          fill
          className="object-contain object-top"
          sizes="58vw"
        />
      </motion.div>

      {/* ── Right Hanging Origami Crane (bird01) ── */}
      <motion.div
        style={{
          position: "absolute",
          top: "-7%",
          left: "36%",
          width: "55%",
          aspectRatio: "540 / 1310",
          transformOrigin: "50% 0%",
          pointerEvents: "none",
          zIndex: 15,
        }}
        animate={{
          x: [0, -6, 6, -4, 4, 0],
          rotate: [0, -2.5, 2.5, -1.5, 1.5, 0],
        }}
        transition={{
          duration: 9.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.0,
        }}
      >
        <Image
          src="/images/theojesslyn_bird01.png"
          alt="Origami Crane Right"
          fill
          className="object-contain object-top"
          sizes="55vw"
        />
      </motion.div>

      {/* ── Text Block 1: "accommodation" ── */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={textVariant(0.4)}
        style={{
          position: "absolute",
          top: "8%",
          left: "27.5%", // Center of screen: (100% - 45%) / 2
          width: "45%",
          aspectRatio: "168 / 18",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <Image
          src="/images/theojesslyn_accommstext.png"
          alt="accommodation"
          fill
          className="object-contain"
          sizes="45vw"
        />
      </motion.div>

      {/* ── Text Block 2: "Complimentary 2-night hotel stay..." ── */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={textVariant(1.2)}
        style={{
          position: "absolute",
          top: "47%",
          left: "18.5%", // Center of screen: (100% - 63%) / 2
          width: "63%",
          aspectRatio: "244 / 94",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <Image
          src="/images/theojesslyn_complimentarytext.png"
          alt="Complimentary 2-night stay info"
          fill
          className="object-contain"
          sizes="63vw"
        />
      </motion.div>

      {/* ── Text Block 3: "at DOUBLETREE BY HILTON..." ── */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={textVariant(2.0)}
        style={{
          position: "absolute",
          top: "69%",
          left: "-4%", // Center of screen: (100% - 108%) / 2
          width: "108%",
          aspectRatio: "292 / 106",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <Image
          src="/images/theojesslyn_doubletreetext.png"
          alt="at DoubleTree By Hilton Kyoto Higashiyama"
          fill
          className="object-contain"
          sizes="108vw"
        />
      </motion.div>
    </motion.div>
  );
}
