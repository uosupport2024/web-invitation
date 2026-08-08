"use client";

import { useMemo } from "react";

const LEAF_IMAGES = [
  "/images/theojesslyn_mapleleaf_terbang01.png",
  "/images/theojesslyn_mapleleaf_terbang02.png",
];

interface LeafItem {
  id: number;
  imageSrc: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  initRotate: number;
  rotateDirection: number;
  swayAmp: number;
  opacity: number;
}

function createLeaves(count: number): LeafItem[] {
  return Array.from({ length: count }, (_, i) => {
    const duration = 9 + Math.random() * 7;
    const isForeground = i % 3 === 0;
    return {
      id: i,
      imageSrc: LEAF_IMAGES[i % LEAF_IMAGES.length],
      x: (i / count) * 92 + Math.random() * 6,
      size: isForeground ? 38 + Math.random() * 20 : 24 + Math.random() * 14,
      duration,
      delay: -(Math.random() * duration), // pre-start timeline to prevent initial cluster
      initRotate: Math.floor(Math.random() * 360),
      rotateDirection: Math.random() > 0.5 ? 1 : -1,
      swayAmp: 20 + Math.random() * 35,
      opacity: isForeground ? 0.85 + Math.random() * 0.15 : 0.65 + Math.random() * 0.2,
    };
  });
}

interface FallingLeavesProps {
  count?: number;
  visible?: boolean;
}

export function FallingLeaves({ count = 15, visible = true }: FallingLeavesProps) {
  const leaves = useMemo(() => createLeaves(count), [count]);

  if (!visible) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes gpuFallAndSway {
          0% {
            transform: translate3d(0, -12vh, 0) rotate(var(--rot-start));
          }
          25% {
            transform: translate3d(var(--sway-amp), 22vh, 0) rotate(calc(var(--rot-start) + 90deg * var(--rot-dir)));
          }
          50% {
            transform: translate3d(calc(-0.7 * var(--sway-amp)), 54vh, 0) rotate(calc(var(--rot-start) + 180deg * var(--rot-dir)));
          }
          75% {
            transform: translate3d(calc(0.4 * var(--sway-amp)), 84vh, 0) rotate(calc(var(--rot-start) + 270deg * var(--rot-dir)));
          }
          100% {
            transform: translate3d(0, 114vh, 0) rotate(calc(var(--rot-start) + 360deg * var(--rot-dir)));
          }
        }

        .falling-leaf-gpu {
          position: absolute;
          top: 0;
          pointer-events: none;
          will-change: transform;
          animation-name: gpuFallAndSway;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
      `}</style>

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
          <div
            key={leaf.id}
            className="falling-leaf-gpu"
            style={{
              left: `${leaf.x}%`,
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              opacity: leaf.opacity,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              ["--sway-amp" as string]: `${leaf.swayAmp}px`,
              ["--rot-start" as string]: `${leaf.initRotate}deg`,
              ["--rot-dir" as string]: leaf.rotateDirection,
            }}
          >
            <img
              src={leaf.imageSrc}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}


