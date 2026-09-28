import * as THREE from "three";
import { local, smooth } from "../timeline";
import { COLORS, lerp, plusPatternTexture, sheenTexture } from "../textures";
import { FACE_Z, PANEL_H, PANEL_W } from "./LiftPanel";
import type { ObjectContext, SceneObject } from "../types";

/*
  Chapter 4 "Bond": a turquoise layer spreads across the steel from left to right,
  then the brand "+" pattern (the charged tips) glows up within it. A clipping plane
  does the reveal, so the pattern never stretches. Both stay for "protect" and "verify".
  Needs renderer.localClippingEnabled.
*/
export function createFilm(ctx: ObjectContext): SceneObject {
  const group = new THREE.Group();
  const w = PANEL_W - 0.06;
  const h = PANEL_H - 0.06;
  const clip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

  const geo = new THREE.PlaneGeometry(w, h);
  const tintMat = new THREE.MeshBasicMaterial({
    color: COLORS.turquoise,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    clippingPlanes: [clip],
    toneMapped: false,
  });
  const tint = new THREE.Mesh(geo, tintMat);
  tint.position.z = FACE_Z + 0.004;

  const patternTex = plusPatternTexture();
  patternTex.repeat.set(w / 0.9, h / 0.9);
  const patternMat = new THREE.MeshBasicMaterial({
    color: COLORS.turquoise,
    map: patternTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    clippingPlanes: [clip],
    toneMapped: false,
  });
  const pattern = new THREE.Mesh(geo, patternMat);
  pattern.position.z = FACE_Z + 0.056; // above the button faces, so the tips cover them too

  // a soft glowing band that leads the wipe
  const bandTex = sheenTexture();
  const bandGeo = new THREE.PlaneGeometry(ctx.quality === "high" ? 0.5 : 0.6, h);
  const bandMat = new THREE.MeshBasicMaterial({
    color: COLORS.turquoise,
    map: bandTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const band = new THREE.Mesh(bandGeo, bandMat);
  band.position.z = FACE_Z + 0.06;

  group.add(tint, pattern, band);

  const edgeLocal = new THREE.Vector3();
  const edgeWorld = new THREE.Vector3();
  const normalWorld = new THREE.Vector3();

  return {
    group,
    update(p, time) {
      const bond = local(p, "bond");
      group.visible = bond > 0;
      if (!group.visible) return;

      const wipe = smooth(bond / 0.55);
      const x = lerp(-w / 2 - 0.02, w / 2 + 0.02, wipe);

      // move the clipping plane with the panel: keep everything left of the wipe edge
      group.updateWorldMatrix(true, false);
      edgeWorld.copy(edgeLocal.set(x, 0, 0)).applyMatrix4(group.matrixWorld);
      normalWorld.set(-1, 0, 0).transformDirection(group.matrixWorld);
      clip.setFromNormalAndCoplanarPoint(normalWorld, edgeWorld);

      band.position.x = x;
      bandMat.opacity = wipe > 0 && wipe < 1 ? 0.75 * Math.sin(Math.PI * wipe) + 0.15 : 0;

      const protect = local(p, "protect");
      tintMat.opacity = 0.16 * smooth(bond * 2) + 0.03 * Math.sin(time * 1.3) * protect;
      // the "+" tips glow up once the layer is down
      patternMat.opacity = 0.75 * smooth((bond - 0.4) / 0.5) * (0.85 + 0.15 * Math.sin(time * 1.1));
      patternTex.offset.y = time * 0.004;
    },
    dispose() {
      [geo, tintMat, patternTex, patternMat, bandTex, bandGeo, bandMat].forEach((d) => d.dispose());
    },
  };
}
