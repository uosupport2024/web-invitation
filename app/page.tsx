"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { WagasaSection } from "@/components/sections/WagasaSection";
import { FallingLeaves } from "@/components/FallingLeaves";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNextPage, setIsNextPage] = useState(false);

  return (
    // Outer: overflow hidden — user CANNOT manually scroll the page
    <div
      style={{
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#000",
        position: "relative",
      }}
    >
      {/* ── Section 1: Wagasa Intro — slides UP when opened ── */}
      <motion.div
        animate={{ y: isOpen ? "-100%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <WagasaSection onOpen={() => setIsOpen(true)} />
      </motion.div>

      {/* ── Section 2: bgscroll.png + overlays ── */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Container relative — overlays positioned against bgscroll */}
        <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
          {/* Background scroll image */}
          <Image
            src="/images/theojesslyn_bgscroll.png"
            alt="Wedding invitation"
            width={900}
            height={3200}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />

          {/* Date overlay — "10th of NOVEMBER 2026 in KYOTO" over pagoda scene */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "55%",
              aspectRatio: "400 / 120",
              pointerEvents: "none",
            }}
          >
            <Image
              src="/images/theojesslyn_date.png"
              alt="10th of November 2026 in Kyoto"
              fill
              className="object-contain"
              sizes="55vw"
            />
          </div>

          {/* Names overlay — above leaves (zIndex: 10) */}
          <div
            style={{
              position: "absolute",
              top: "70%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "68%",
              aspectRatio: "600 / 530",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <Image
              src="/images/theojesslyn_names.png"
              alt="Theodore Otto Hartono & Jesslyn Mulianto"
              fill
              className="object-contain"
              sizes="85vw"
            />
          </div>

          {/* Maple leaf — Upper Right (mapleleaf01) — wind sway */}
          <motion.div
            style={{
              position: "absolute",
              top: "60%",
              right: "-2%",
              width: "70%",
              aspectRatio: "516 / 280",
              pointerEvents: "none",
              transformOrigin: "90% 30%",
              zIndex: 5,
            }}
            animate={{ rotate: [0, 4, -2, 3, 0], y: [0, -4, 2, -3, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/theojesslyn_mapleleaf01.png"
              alt=""
              fill
              className="object-contain object-right"
              sizes="55vw"
            />
          </motion.div>

          {/* Maple leaf — Left (mapleleaf02) — wind sway */}
          <motion.div
            style={{
              position: "absolute",
              top: "78%",
              left: "-10%",
              width: "70%",
              aspectRatio: "516 / 280",
              pointerEvents: "none",
              transformOrigin: "10% 60%",
              zIndex: 5,
            }}
            animate={{ rotate: [0, -3, 2, -4, 0], y: [0, 3, -2, 4, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/theojesslyn_mapleleaf02.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="55vw"
            />
          </motion.div>

          {/* Maple leaf — Left flipped vertical (mapleleaf02 scaleY -1) — wind sway */}
          <motion.div
            style={{
              position: "absolute",
              top: "90%",
              left: "-10%",
              width: "70%",
              aspectRatio: "516 / 280",
              pointerEvents: "none",
              transform: "scaleY(-1)",
              transformOrigin: "10% 40%",
              zIndex: 5,
            }}
            animate={{ rotate: [0, 5, -3, 4, 0], y: [0, -3, 2, -4, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Image
              src="/images/theojesslyn_mapleleaf02.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="55vw"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Section 3: Image 4.1 — slides in when bottom CTA clicked ── */}
      <AnimatePresence>
        {isNextPage && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              background: "#1a1008",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Placeholder — Image 4.1 will go here */}
            <p style={{ color: "#E5C7A5", fontFamily: "serif", fontSize: "1.2rem" }}>
              Image 4.1
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Falling Leaves overlay (visible on section 2) ── */}
      <FallingLeaves visible={isOpen && !isNextPage} count={18} />

      {/* ── Bottom CTA: "* Click on the Autumn Leaf" ── */}
      <AnimatePresence>
        {isOpen && !isNextPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            onClick={() => setIsNextPage(true)}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 60,
              padding: "20px 0 28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.82)",
                fontFamily: "Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textAlign: "center",
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              }}
            >
              * Click on the Autumn Leaf
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
