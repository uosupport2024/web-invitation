"use client";

import { motion } from "motion/react";

interface ScrollChevronProps {
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function ScrollChevron({ onClick, style }: ScrollChevronProps) {
  return (
    <motion.button
      type="button"
      aria-label="Scroll down"
      initial={{ opacity: 0, y: -6 }}
      animate={{
        opacity: 1,
        y: [0, 5, 0],
      }}
      exit={{ opacity: 0, y: 6 }}
      transition={{
        y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.35 },
      }}
      whileHover={{ scale: 1.1, backgroundColor: "rgba(30, 20, 15, 0.7)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        left: 0,
        right: 0,
        margin: "0 auto",
        zIndex: 60,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "rgba(30, 20, 15, 0.45)",
        border: "1px solid rgba(243, 213, 181, 0.4)",
        color: "#F3D5B5",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
        outline: "none",
        padding: 0,
        pointerEvents: "auto",
        ...style,
      }}
    >
      <svg
        width="18"
        height="10"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 1.5L7 6.5L12.5 1.5"
          stroke="#F3D5B5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
