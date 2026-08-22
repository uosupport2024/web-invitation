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
          fontSize: "0.72rem",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          fontWeight: 600,
          textShadow: "0 2px 8px rgba(0,0,0,0.85)",
          background: "rgba(97, 41, 26, 0.94)",
          padding: "6px 15px",
          borderRadius: "9999px",
          border: "1px dashed rgba(243, 213, 181, 0.8)",
          boxShadow: "0 3px 12px rgba(0,0,0,0.5)",
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
          style={{ marginTop: "3px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }}
        >
          {arrowDirection === "up" ? (
            <span
              style={{
                fontSize: "1.1rem",
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
              width="15"
              height="8"
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L9 9L17 1"
                stroke="#F3D5B5"
                strokeWidth="2.2"
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
