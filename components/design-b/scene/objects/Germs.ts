import * as THREE from "three";
import { ORDINARY_TOUCHES, easeOut, local, smooth } from "../timeline";
import { COLORS, germTexture, lerp, radialTexture, seeded } from "../textures";
import { BUTTONS, FACE_Z } from "./LiftPanel";
import type { ObjectContext, SceneObject } from "../types";

/*
  Germs: soft translucent microbes (a capsule, a coccus and a two-cell cluster) on sprites that
  always face the camera, with a contact shadow baked in. Calm on purpose: never red or green.
  - chapter 2 "ordinary": after each touch, germs settle beside the button; cleared in "apply";
  - chapter 5 "protect": germs drift in one after another and break apart on contact with
    the bonded layer, scattering into small turquoise sparks.
*/

const PER_TOUCH = 3;
const INCOMING = 8;
const SPARKS_PER = 14;
const APPROACH = 0.09; // share of "protect" a germ takes to reach the surface
const BURST = 0.07; // share of "protect" its sparks live
const SIZE = 0.5;

export function createGerms(ctx: ObjectContext): SceneObject {
  const group = new THREE.Group();
  const rand = seeded(5);
  const textures = [germTexture("rod"), germTexture("round"), germTexture("pair")];
  let made = 0;
  const materials: THREE.SpriteMaterial[] = [];

  const sprite = () => {
    const mat = new THREE.SpriteMaterial({
      map: textures[made++ % 3],
      transparent: true,
      depthWrite: false,
      rotation: rand() * Math.PI * 2,
    });
    materials.push(mat);
    const s = new THREE.Sprite(mat);
    s.scale.set(SIZE, SIZE, 1);
    s.visible = false;
    group.add(s);
    return s;
  };

  // ordinary: two germs beside each touched button, appearing just after the touch
  const settled = ORDINARY_TOUCHES.flatMap((t) =>
    Array.from({ length: PER_TOUCH }, (_, k) => {
      const [bx, by] = BUTTONS[t.button];
      const a = rand() * Math.PI * 2;
      const r = 0.46 + rand() * 0.08;
      const s = sprite();
      s.position.set(bx + Math.cos(a) * r, by + Math.sin(a) * r, FACE_Z + 0.09);
      return { s, at: t.at + 0.05 + k * 0.05, rot: s.material.rotation, phase: rand() * 6, size: SIZE * (0.75 + rand() * 0.5) };
    }),
  );

  // protect: approaching from outside the panel
  const incoming = Array.from({ length: INCOMING }, (_, i) => {
    const ang = (i / INCOMING) * Math.PI * 2 + 0.4;
    const from = new THREE.Vector3(Math.cos(ang) * 2.4, Math.sin(ang) * 2.1, 1.9);
    const to = new THREE.Vector3((rand() * 2 - 1) * 0.55, -1.15 + rand() * 1.7, FACE_Z + 0.09);
    const s = sprite();
    const dirs = Array.from({ length: SPARKS_PER }, () => {
      const t = rand() * Math.PI * 2;
      return new THREE.Vector3(Math.cos(t), Math.sin(t), rand() * 0.5);
    });
    return { s, from, to, start: 0.04 + i * 0.11, dirs, phase: rand() * 6, size: SIZE * (0.8 + rand() * 0.45) };
  });

  // sparks: one Points layer; colour doubles as brightness under additive blending
  const sparkCount = INCOMING * SPARKS_PER;
  const sparkPos = new Float32Array(sparkCount * 3);
  const sparkCol = new Float32Array(sparkCount * 3);
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkCol, 3));
  const sparkTex = radialTexture(32, 0.25);
  const sparkMat = new THREE.PointsMaterial({
    size: ctx.quality === "high" ? 0.09 : 0.11,
    map: sparkTex,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  group.add(sparks);
  const turq = new THREE.Color(COLORS.turquoise);

  return {
    group,
    update(p, time) {
      const o = local(p, "ordinary");
      const clear = 1 - smooth((local(p, "apply") - 0.2) / 0.5);
      settled.forEach((g) => {
        const k = smooth((o - g.at) / 0.08) * clear;
        g.s.visible = k > 0.001;
        g.s.scale.set(g.size * k, g.size * k, 1);
        g.s.material.rotation = g.rot + Math.sin(time * 0.9 + g.phase) * 0.2;
      });

      const pl = local(p, "protect");
      const active = pl > 0 && pl < 1;
      incoming.forEach((g, i) => {
        const a = (pl - g.start) / APPROACH;
        g.s.visible = active && a > 0 && a < 1;
        if (g.s.visible) {
          const e = easeOut(a);
          g.s.position.set(lerp(g.from.x, g.to.x, e), lerp(g.from.y, g.to.y, e), lerp(g.from.z, g.to.z, e));
          g.s.material.rotation = time * 0.6 + g.phase;
          const pulse = g.size * (1 + 0.06 * Math.sin(time * 3 + g.phase));
          g.s.scale.set(pulse, pulse, 1);
        }
        const b = (pl - g.start - APPROACH) / BURST;
        const on = active && b > 0 && b < 1;
        const spread = easeOut(b) * 0.45;
        const bright = on ? 1 - b : 0;
        g.dirs.forEach((d, k) => {
          const idx = (i * SPARKS_PER + k) * 3;
          sparkPos[idx] = g.to.x + d.x * spread;
          sparkPos[idx + 1] = g.to.y + d.y * spread;
          sparkPos[idx + 2] = g.to.z + d.z * spread;
          sparkCol[idx] = turq.r * bright;
          sparkCol[idx + 1] = turq.g * bright;
          sparkCol[idx + 2] = turq.b * bright;
        });
      });
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.color.needsUpdate = true;
      sparks.visible = active;
    },
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
      [sparkGeo, sparkTex, sparkMat].forEach((d) => d.dispose());
    },
  };
}
