import * as THREE from "three";
import { ORDINARY_TOUCHES, PRESS_LIFE, PROTECT_TOUCHES, local, smooth } from "../timeline";
import { COLORS, fingerprintTexture } from "../textures";
import { BUTTONS, FACE_Z } from "./LiftPanel";
import type { ObjectContext, SceneObject } from "../types";

/*
  Touches, on the shared schedule in timeline.ts (the buttons light up at the same moments).
  - chapter 2 "ordinary": each touch leaves a print that stays (cleared in "apply");
  - chapter 5 "protect": each print lands and fades, with a turquoise pulse where the
    bonded layer meets it.
*/
export function createFingerprints(ctx: ObjectContext): SceneObject {
  const group = new THREE.Group();
  const tex = fingerprintTexture();
  const printGeo = new THREE.PlaneGeometry(0.36, 0.44);
  const ringGeo = new THREE.RingGeometry(0.2, 0.225, ctx.quality === "high" ? 48 : 28);
  const materials: THREE.Material[] = [];

  const place = (button: number, dx: number, dy: number, rot: number) => {
    const [x, y] = BUTTONS[button];
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: COLORS.spring, transparent: true, opacity: 0, depthWrite: false });
    materials.push(mat);
    const mesh = new THREE.Mesh(printGeo, mat);
    mesh.position.set(x + dx, y + dy, FACE_Z + 0.07);
    mesh.rotation.z = rot;
    group.add(mesh);
    return { mesh, mat, x: x + dx, y: y + dy };
  };

  const lingering = ORDINARY_TOUCHES.map((t, i) => ({ t, ...place(t.button, t.dx, t.dy, (i % 2 ? 1 : -1) * 0.3) }));

  const landings = PROTECT_TOUCHES.map((t, j) => {
    const pr = place(t.button, t.dx, t.dy, (j % 3) * 0.25 - 0.25);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLORS.turquoise,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    materials.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(pr.x, pr.y, FACE_Z + 0.075);
    group.add(ring);
    return { t, ...pr, ring, ringMat };
  });

  return {
    group,
    update(p) {
      const o = local(p, "ordinary");
      const clear = 1 - smooth((local(p, "apply") - 0.15) / 0.5);
      lingering.forEach((l) => {
        l.mat.opacity = 0.5 * smooth((o - l.t.at) / 0.06) * clear;
        l.mesh.visible = l.mat.opacity > 0.002;
      });

      const pl = local(p, "protect");
      const inProtect = pl > 0 && pl < 1;
      landings.forEach((l) => {
        const v = (pl - l.t.at) / (PRESS_LIFE * 1.2);
        const on = inProtect && v > 0 && v < 1;
        l.mat.opacity = on ? 0.5 * (1 - smooth(v)) : 0;
        l.mesh.visible = on;
        l.ringMat.opacity = on ? 0.9 * (1 - v) : 0;
        l.ring.visible = on;
        l.ring.scale.setScalar(1 + v * 0.9);
      });
    },
    dispose() {
      tex.dispose();
      printGeo.dispose();
      ringGeo.dispose();
      materials.forEach((m) => m.dispose());
    },
  };
}
