import * as THREE from "three";
import { local, smooth } from "../timeline";
import { COLORS, lerp, radialTexture, seeded, sheenTexture } from "../textures";
import { FACE_Z, PANEL_H, PANEL_W } from "./LiftPanel";
import type { ObjectContext, SceneObject } from "../types";

/*
  Two sweeps across the panel:
  - chapter 2 "ordinary": a quick white sheen, the surface freshly wiped;
  - chapter 3 "apply": a sheet of fine turquoise mist drifting left → right.
*/
export function createMist(ctx: ObjectContext): SceneObject {
  const group = new THREE.Group();

  // sheen
  const sheenTex = sheenTexture();
  const sheenGeo = new THREE.PlaneGeometry(0.9, PANEL_H - 0.1);
  const sheenMat = new THREE.MeshBasicMaterial({
    map: sheenTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sheen = new THREE.Mesh(sheenGeo, sheenMat);
  sheen.position.z = FACE_Z + 0.07;
  sheen.rotation.z = 0.18;
  group.add(sheen);

  // mist
  const count = ctx.quality === "high" ? 1500 : 600;
  const rand = seeded(11);
  const seeds = new Float32Array(count * 4); // y, z, lag, speed
  for (let i = 0; i < count; i++) {
    seeds.set([(rand() * 2 - 1) * (PANEL_H / 2 + 0.3), FACE_Z + 0.05 + rand() * 0.8, rand(), 0.8 + rand() * 0.5], i * 4);
  }
  const positions = new Float32Array(count * 3);
  const mistGeo = new THREE.BufferGeometry();
  mistGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mistTex = radialTexture(32, 0.2);
  const mistMat = new THREE.PointsMaterial({
    color: COLORS.turquoiseTint,
    map: mistTex,
    size: ctx.quality === "high" ? 0.05 : 0.07,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mist = new THREE.Points(mistGeo, mistMat);
  group.add(mist);

  return {
    group,
    update(p, time) {
      // sheen: first 30% of "ordinary"
      const o = local(p, "ordinary");
      const sweep = smooth(o / 0.3);
      sheen.position.x = lerp(-PANEL_W, PANEL_W, sweep);
      sheenMat.opacity = o > 0 && o < 0.3 ? Math.sin(Math.PI * sweep) * 0.55 : 0;
      sheen.visible = sheenMat.opacity > 0;

      // mist: whole of "apply"
      const a = local(p, "apply");
      mist.visible = a > 0 && a < 1;
      mistMat.opacity = Math.sin(Math.PI * a) * 0.9;
      if (mist.visible) {
        for (let i = 0; i < count; i++) {
          const y = seeds[i * 4];
          const z = seeds[i * 4 + 1];
          const lag = seeds[i * 4 + 2];
          const speed = seeds[i * 4 + 3];
          const t = a * 1.6 * speed - lag * 0.6;
          positions[i * 3] = lerp(-PANEL_W - 1.2, PANEL_W + 1.2, t);
          positions[i * 3 + 1] = y + Math.sin(time * 0.8 + lag * 12) * 0.03;
          positions[i * 3 + 2] = z;
        }
        mistGeo.attributes.position.needsUpdate = true;
      }
    },
    dispose() {
      [sheenTex, sheenGeo, sheenMat, mistGeo, mistTex, mistMat].forEach((d) => d.dispose());
    },
  };
}
