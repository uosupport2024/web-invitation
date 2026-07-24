export type SceneState = "scene1" | "scene2" | "scene3" | "scene4";

export interface WagasaTransform {
  top: number;
  left: number;
  size: number;
}

export interface WagasaConfigItem {
  src: string;
  z: number;
  swayAngle: number;
  driftX: number;
  driftY: number;
  swayDuration: number;
  exitDelay: number;
  closed: WagasaTransform;
  open: WagasaTransform;
}

export interface WagasaSectionProps {
  onOpen?: () => void;
}
