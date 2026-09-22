"use client";

import { motion } from "motion/react";

interface InstructionPillProps {
  text: string;
  showArrow?: boolean;
  arrowDirection?: "up" | "down";
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function InstructionPill({
  text,
  showArrow = false,
  arrowDirection = "down",
  size = "sm",
  onClick,
  style,
}: InstructionPillProps) {
  const formattedText = text.trim();
  const isXs = size === "xs";
  const isLarge = size === "lg";

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
          fontSize: isXs ? "0.62rem" : isLarge ? "0.95rem" : "0.78rem",
          letterSpacing: isXs ? "0.10em" : isLarge ? "0.10em" : "0.14em",
          textTransform: "uppercase",
          fontWeight: isXs ? 500 : 600,
          textShadow: "0 2px 8px rgba(0,0,0,0.85)",
          background: "rgba(97, 41, 26, 0.94)",
          padding: isXs ? "3px 10px" : isLarge ? "9px 20px" : "7px 16px",
          borderRadius: "9999px",
          border: isXs
            ? "1px dashed rgba(243, 213, 181, 0.7)"
            : "1px dashed rgba(243, 213, 181, 0.8)",
          boxShadow: isXs
            ? "0 2px 6px rgba(0,0,0,0.4)"
            : "0 3px 12px rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          whiteSpace: "nowrap",
        }}
      >
        {formattedText}
      </div>

      {showArrow && (
        <motion.div
          animate={{ y: arrowDirection === "up" ? [0, -4, 0] : [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            marginTop: isLarge ? "5px" : "4px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))",
          }}
        >
          {arrowDirection === "up" ? (
            <span
              style={{
                fontSize: isLarge ? "1.4rem" : "1.15rem",
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
              width={isLarge ? "20" : "16"}
              height={isLarge ? "11" : "9"}
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L9 9L17 1"
                stroke="#F3D5B5"
                strokeWidth={isLarge ? "2.2" : "2.4"}
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
