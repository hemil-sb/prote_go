import * as THREE from "three";
import { local, smooth } from "../timeline";
import { COLORS, plusSpriteTexture, radialTexture, seeded } from "../textures";
import type { ObjectContext, SceneObject } from "../types";

/*
  The brand "+" as a faint protective shimmer in the lobby air. Strongest on the opening
  shot, thinning as the camera moves in to the panel, gone by the close-ups.
  Three depths: fine, crisp, and soft out-of-focus glow near the camera.
*/

interface Layer {
  count: number;
  size: number;
  opacity: number;
  soft?: boolean;
}

// the volume of air between the camera path and the wall (world units)
const VOLUME = { x: [-22, 16], y: [-8.5, 13], z: [3, 40] } as const;

export function createPlusField(ctx: ObjectContext): SceneObject {
  const high = ctx.quality === "high";
  const layers: Layer[] = [
    { count: high ? 520 : 220, size: 0.13, opacity: 0.55 },
    { count: high ? 160 : 70, size: 0.26, opacity: 0.85 },
    { count: high ? 36 : 14, size: 1.6, opacity: 0.07, soft: true },
  ];

  const group = new THREE.Group();
  const plusTex = plusSpriteTexture();
  const softTex = radialTexture(64, 0.05);
  const rand = seeded(42);
  const span = (r: readonly [number, number]) => r[0] + rand() * (r[1] - r[0]);

  const built = layers.map((l) => {
    const pos = new Float32Array(l.count * 3);
    for (let i = 0; i < l.count; i++) {
      pos[i * 3] = span(VOLUME.x);
      pos[i * 3 + 1] = span(VOLUME.y);
      pos[i * 3 + 2] = span(VOLUME.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: l.soft ? COLORS.turquoiseTint : COLORS.turquoise,
      map: l.soft ? softTex : plusTex,
      size: l.size,
      sizeAttenuation: true,
      transparent: true,
      opacity: l.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);
    return { l, geo, mat, points };
  });

  return {
    group,
    update(p, time) {
      // full on the opening, thinning through "pullout", gone early in "ordinary"
      const k = (1 - 0.6 * smooth(local(p, "pullout"))) * (1 - smooth(local(p, "ordinary") / 0.35));
      group.visible = k > 0.001;
      built.forEach((b, i) => {
        b.mat.opacity = b.l.opacity * k * (0.85 + 0.15 * Math.sin(time * (0.7 + i * 0.3) + i));
        // slow drift, like dust in still air
        b.points.position.y = Math.sin(time * 0.12 + i) * 0.6;
        b.points.position.x = Math.cos(time * 0.09 + i * 2) * 0.5;
      });
    },
    dispose() {
      built.forEach((b) => {
        b.geo.dispose();
        b.mat.dispose();
      });
      plusTex.dispose();
      softTex.dispose();
    },
  };
}
