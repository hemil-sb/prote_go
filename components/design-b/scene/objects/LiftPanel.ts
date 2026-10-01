import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { pressLevel } from "../timeline";
import { COLORS, arrowTexture, displayTexture, shadowTexture } from "../textures";
import type { ObjectContext, SceneObject } from "../types";

/*
  The hero surface: a lift call station, as found beside every lift door. Brushed-steel
  plate on a dark bezel, a glowing floor display, and two call buttons (up and down) that
  light up when pressed. It hangs on the lobby wall; everything that happens "on the
  surface" (film, germs, fingerprints) is parented to `surface`.
*/

export const PANEL_W = 1.6;
export const PANEL_H = 3.0;
const DEPTH = 0.12;
/** z of the plate's front face, in panel space */
export const FACE_Z = DEPTH / 2;

/** the call buttons, panel space: up, then down. Touches and germs gather here. */
export const BUTTONS: readonly [number, number][] = [
  [0, 0.08],
  [0, -0.8],
];
const ARROWS = ["up", "down"] as const;
const BUTTON_R = 0.34;

export interface LiftPanel extends SceneObject {
  /** attach surface effects here */
  surface: THREE.Group;
}

export function createLiftPanel(ctx: ObjectContext): LiftPanel {
  const group = new THREE.Group();
  const surface = new THREE.Group();
  group.add(surface);

  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);

  // dark bezel behind the plate
  const bezel = new THREE.Mesh(
    keep(new RoundedBoxGeometry(PANEL_W + 0.22, PANEL_H + 0.22, 0.1, 5, 0.1)),
    keep(new THREE.MeshPhysicalMaterial({ color: COLORS.sherpaDeep, roughness: 0.5, metalness: 0.4, clearcoat: 0.4 })),
  );
  bezel.position.z = -0.06;
  surface.add(bezel);

  // brushed-steel plate
  const plate = new THREE.Mesh(
    keep(new RoundedBoxGeometry(PANEL_W, PANEL_H, DEPTH, 5, 0.08)),
    keep(
      new THREE.MeshPhysicalMaterial({
        color: "#b9cbcf",
        metalness: 1,
        roughness: 0.34,
        anisotropy: 0.7,
        clearcoat: 0.25,
        clearcoatRoughness: 0.4,
      }),
    ),
  );
  surface.add(plate);

  // floor display
  const dispTex = keep(displayTexture());
  const display = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(1.12, 0.28)),
    keep(new THREE.MeshBasicMaterial({ map: dispTex, toneMapped: false })),
  );
  display.position.set(0, 1.02, FACE_Z + 0.014);
  const dispFrame = new THREE.Mesh(
    keep(new RoundedBoxGeometry(1.24, 0.4, 0.03, 3, 0.04)),
    keep(new THREE.MeshStandardMaterial({ color: COLORS.sherpaDeep, metalness: 0.5, roughness: 0.4 })),
  );
  dispFrame.position.set(0, 1.02, FACE_Z - 0.008);
  surface.add(dispFrame, display);

  // call buttons: steel rim, dark glass face, white arrow, and a ring that lights when pressed
  const rimMat = keep(new THREE.MeshStandardMaterial({ color: "#e3eef0", metalness: 1, roughness: 0.18 }));
  const faceMat = keep(
    new THREE.MeshPhysicalMaterial({ color: "#0b2429", roughness: 0.25, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.12 }),
  );
  const segments = ctx.quality === "high" ? 64 : 40;
  const rimGeo = keep(new THREE.TorusGeometry(BUTTON_R + 0.025, 0.04, 18, segments));
  const faceGeo = keep(new THREE.CylinderGeometry(BUTTON_R, BUTTON_R, 0.05, segments));
  const glowGeo = keep(new THREE.TorusGeometry(BUTTON_R + 0.035, 0.055, 18, segments));
  const arrowGeo = keep(new THREE.PlaneGeometry(BUTTON_R * 1.25, BUTTON_R * 1.25));
  const glows: THREE.MeshBasicMaterial[] = [];

  BUTTONS.forEach(([x, y], i) => {
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.set(x, y, FACE_Z + 0.012);
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.rotation.x = Math.PI / 2;
    face.position.set(x, y, FACE_Z + 0.025);
    const arrow = new THREE.Mesh(
      arrowGeo,
      keep(new THREE.MeshBasicMaterial({ map: keep(arrowTexture(ARROWS[i])), transparent: true, opacity: 0.92 })),
    );
    arrow.position.set(x, y, FACE_Z + 0.052);
    const glowMat = keep(
      new THREE.MeshBasicMaterial({
        color: COLORS.turquoise,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(x, y, FACE_Z + 0.02);
    glows.push(glowMat);
    surface.add(rim, face, arrow, glow);
  });

  // soft contact shadow behind the panel, for depth
  const shadow = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(PANEL_W * 2.7, PANEL_H * 2.0)),
    keep(new THREE.MeshBasicMaterial({ map: keep(shadowTexture()), transparent: true, opacity: 0.7, depthWrite: false })),
  );
  shadow.position.set(0.25, -0.25, -0.7);
  group.add(shadow);

  return {
    group,
    surface,
    update(p) {
      glows.forEach((m, i) => {
        m.opacity = 0.95 * pressLevel(p, i);
      });
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
