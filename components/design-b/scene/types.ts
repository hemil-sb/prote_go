import type * as THREE from "three";

export type Quality = "high" | "low";
/** where the panel sits in the frame: right half (desktop), top ~55% (phones), centred (stills) */
export type Layout = "side" | "top" | "center";

/** every scene object: its state is a pure function of scroll progress p; time only adds idle wobble */
export interface SceneObject {
  group: THREE.Object3D;
  update(p: number, time: number): void;
  /** optional: react to the frame layout (phones frame the panel in the top half) */
  setLayout?(layout: Layout): void;
  dispose(): void;
}

export interface ObjectContext {
  quality: Quality;
}
