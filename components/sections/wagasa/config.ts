import { WagasaConfigItem } from "./types";

// 8 Wagasa umbrellas configuration with closed (center cluster) & open (frame border) positions + sway wind drift
export const wagasas: WagasaConfigItem[] = [
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
