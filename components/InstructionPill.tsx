"use client";

import { motion } from "motion/react";

interface InstructionPillProps {
  text: string;
  showArrow?: boolean;
  arrowDirection?: "up" | "down";
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function InstructionPill({
  text,
  showArrow = false,
  arrowDirection = "down",
  onClick,
  style,
}: InstructionPillProps) {
  const formattedText = text.trim();

  return (
    <motion.div
      animate={{ y: arrowDirection === "up" ? [0, -4, 0] : [0, 4, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      onClick={onClick}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div
        style={{
          margin: 0,
          color: "#F3D5B5",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "0.92rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 600,
          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          background: "rgba(97, 41, 26, 0.94)",
          padding: "10px 24px",
          borderRadius: "9999px",
          border: "1.5px dashed rgba(243, 213, 181, 0.85)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          whiteSpace: "nowrap",
        }}
      >
        {formattedText}
      </div>

      {showArrow && (
        <motion.div
          animate={{ y: arrowDirection === "up" ? [0, -3, 0] : [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginTop: "5px", filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.7))" }}
        >
          {arrowDirection === "up" ? (
            <span
              style={{
                fontSize: "1.5rem",
                color: "#F3D5B5",
                display: "block",
                lineHeight: 1,
                fontWeight: "bold",
              }}
            >
              ↑
            </span>
          ) : (
            <svg
              width="22"
              height="12"
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L9 9L17 1"
                stroke="#F3D5B5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
