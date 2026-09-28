import * as THREE from "three";
import { local, smooth } from "../timeline";
import { COLORS, plusSpriteTexture, radialTexture, seeded } from "../textures";
import type { ObjectContext, SceneObject } from "../types";

/*
  The opening: a dense field of glowing brand "+" marks floating in the dark. Scrolling
  carries them toward the camera (a fly-through) while the lift lobby fades up behind them,
  and they clear by "Every surface gets touched". Lives in camera space (add `group` to the
  camera), so it surrounds the viewer whatever the shot.
*/

interface Layer {
  count: number;
  size: number;
  opacity: number;
  soft?: boolean;
}

const DEPTH = 7; // camera-space depth of the field
const NEAR = -0.55; // closest a mark gets before it wraps to the back

/** 0..1: how present the particles are at p (fully, from load; gone by the end of "pullout") */
export function streamEnvelope(p: number): number {
  return 1 - smooth((local(p, "pullout") - 0.45) / 0.4);
}

/** 0..1: how far the dark has lifted to show the lobby (hidden at load, fully shown late in "pullout") */
export function revealAt(p: number): number {
  return smooth((local(p, "pullout") - 0.1) / 0.6);
}

export function createParticleStream(ctx: ObjectContext): SceneObject {
  const high = ctx.quality === "high";
  const layers: Layer[] = [
    { count: high ? 1400 : 600, size: 0.07, opacity: 0.75 }, // fine
    { count: high ? 520 : 220, size: 0.15, opacity: 1 }, // crisp
    { count: high ? 60 : 24, size: 0.7, opacity: 0.08, soft: true }, // out of focus
  ];

  const group = new THREE.Group();
  const plusTex = plusSpriteTexture();
  const softTex = radialTexture(64, 0.05);
  const rand = seeded(42);

  const built = layers.map((l) => {
    const base = new Float32Array(l.count * 3);
    for (let i = 0; i < l.count; i++) {
      base[i * 3] = (rand() * 2 - 1) * 2.8;
      base[i * 3 + 1] = (rand() * 2 - 1) * 1.8;
      base[i * 3 + 2] = rand() * DEPTH; // distance behind the near plane
    }
    const pos = new Float32Array(l.count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: l.soft ? COLORS.turquoiseTint : COLORS.turquoise,
      map: l.soft ? softTex : plusTex,
      size: l.size,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.renderOrder = 10;
    group.add(points);
    return { l, base, pos, geo, mat, points };
  });

  return {
    group,
    update(p, time) {
      const env = streamEnvelope(p);
      group.visible = env > 0.001;
      if (!group.visible) return;
      // scrolling carries the marks toward the camera: a fly-through
      const travel = local(p, "open") * 2.5 + local(p, "pullout") * 9 + time * 0.12;
      built.forEach((b, li) => {
        for (let i = 0; i < b.l.count; i++) {
          const d = (b.base[i * 3 + 2] + travel * (0.8 + li * 0.2)) % DEPTH;
          b.pos[i * 3] = b.base[i * 3];
          b.pos[i * 3 + 1] = b.base[i * 3 + 1];
          b.pos[i * 3 + 2] = NEAR - (DEPTH - d);
        }
        b.geo.attributes.position.needsUpdate = true;
        b.mat.opacity = b.l.opacity * env;
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
