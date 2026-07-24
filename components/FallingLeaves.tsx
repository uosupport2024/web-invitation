"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

/* ── Autumn color palette ── */
const LEAF_VARIANTS = [
  { body: "#C2541E", vein: "#8B2E08", highlight: "#E07040" },
  { body: "#9B2518", vein: "#6B1208", highlight: "#C44028" },
  { body: "#D4722A", vein: "#934A10", highlight: "#E89050" },
  { body: "#A83215", vein: "#7A1E08", highlight: "#D05030" },
  { body: "#C8601A", vein: "#8C3A08", highlight: "#E48040" },
];

/**
 * Realistic Japanese Maple (Momiji) leaf with 5 lobes, serrated edges,
 * visible veins, and subtle highlight layer — purely inline SVG.
 */
function MapleLeaf({ variant }: { variant: typeof LEAF_VARIANTS[number] }) {
  return (
    <svg
      viewBox="0 0 100 115"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      {/* ── Main leaf body — 5-lobed momiji ── */}
      <path
        d="M50,8
           C54,14 62,15 65,10
           C62,18 66,26 73,24
           C79,20 86,23 87,30
           C82,34 75,33 73,39
           C80,39 87,42 87,49
           C81,53 74,50 70,55
           C77,60 78,68 73,73
           C68,68 63,61 58,65
           C55,70 53,77 50,80
           C47,77 45,70 42,65
           C37,61 32,68 27,73
           C22,68 23,60 30,55
           C26,50 19,53 13,49
           C13,42 20,39 27,39
           C25,33 18,34 13,30
           C14,23 21,20 27,24
           C34,26 38,18 35,10
           C38,15 46,14 50,8Z"
        fill={variant.body}
        opacity="0.93"
      />

      {/* ── Highlight layer (lighter area near centre) ── */}
      <path
        d="M50,22
           C53,27 58,28 61,26
           C59,31 60,36 65,37
           C61,38 58,42 60,47
           C57,44 53,44 50,48
           C47,44 43,44 40,47
           C42,42 39,38 35,37
           C40,36 41,31 39,26
           C42,28 47,27 50,22Z"
        fill={variant.highlight}
        opacity="0.28"
      />

      {/* ── Central vein ── */}
      <path
        d="M50,80 Q50,55 50,22"
        fill="none"
        stroke={variant.vein}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Upper-right vein */}
      <path
        d="M50,42 Q60,33 68,26"
        fill="none"
        stroke={variant.vein}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Upper-left vein */}
      <path
        d="M50,42 Q40,33 32,26"
        fill="none"
        stroke={variant.vein}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Lower-right vein */}
      <path
        d="M50,58 Q62,54 70,48"
        fill="none"
        stroke={variant.vein}
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* Lower-left vein */}
      <path
        d="M50,58 Q38,54 30,48"
        fill="none"
        stroke={variant.vein}
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* ── Stem (petiole) ── */}
      <path
        d="M50,80 Q51,94 50,108"
        fill="none"
        stroke={variant.vein}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/* ── Leaf config ── */
interface LeafItem {
  id: number;
  variant: typeof LEAF_VARIANTS[number];
  x: number;
  size: number;
  duration: number;
  delay: number;
  initRotate: number;
  swayAmp: number;
}

function createLeaves(count: number): LeafItem[] {
  return Array.from({ length: count }, (_, i) => {
    const duration = 9 + Math.random() * 7;
    return {
      id: i,
      variant: LEAF_VARIANTS[i % LEAF_VARIANTS.length],
      x: (i / count) * 90 + Math.random() * 8,
      size: 34 + Math.random() * 24, // enlarged leaf size
      duration,
      delay: -Math.random() * duration, // negative delay pre-starts animation at random progress so no clustering at top
      initRotate: Math.random() * 360,
      swayAmp: 25 + Math.random() * 45,
    };
  });
}

interface FallingLeavesProps {
  count?: number;
  visible?: boolean;
}

export function FallingLeaves({ count = 18, visible = true }: FallingLeavesProps) {
  const leaves = useMemo(() => createLeaves(count), [count]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${leaf.x}%`,
            width: leaf.size,
            height: leaf.size,
          }}
          animate={{
            y: ["-10vh", "112vh"],
            rotate: [leaf.initRotate, leaf.initRotate + 270],
            x: [0, leaf.swayAmp, -leaf.swayAmp * 0.6, leaf.swayAmp * 0.2, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: leaf.duration, ease: "easeInOut", repeat: Infinity },
          }}
        >
          <MapleLeaf variant={leaf.variant} />
        </motion.div>
      ))}
    </div>
  );
}
