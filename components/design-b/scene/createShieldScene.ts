import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { local, smooth } from "./timeline";
import { COLORS, voidTexture } from "./textures";
import { BUTTONS, FACE_Z, PANEL_H, PANEL_W, createLiftPanel } from "./objects/LiftPanel";
import { createLobby } from "./objects/Lobby";
import { createPlusField } from "./objects/PlusField";
import { createParticleStream, revealAt, streamEnvelope } from "./objects/ParticleStream";
import { createFilm } from "./objects/Film";
import { createMist } from "./objects/Mist";
import { createGerms } from "./objects/Germs";
import { createFingerprints } from "./objects/Fingerprints";
import type { Layout, Quality, SceneObject } from "./types";

export type { Layout, Quality } from "./types";

/** named points on the panel whose screen position the page can follow (labels) */
export type AnchorName = "up" | "down" | "panelTop" | "panelLeft" | "panelRight";
export type AnchorPoints = Partial<Record<AnchorName, { x: number; y: number }>>;

export interface ShieldScene {
  /** scroll progress 0..1; the next frame renders it */
  setProgress(p: number): void;
  /** pointer position, -1..1 on both axes (gentle camera parallax on desktop) */
  setPointer(x: number, y: number): void;
  setLayout(layout: Layout): void;
  resize(): void;
  /** run or pause the frame loop (off-screen, hidden tab) */
  setActive(on: boolean): void;
  /** render one frame at p and return it as a JPEG data URL (reduced-motion stills) */
  renderStill(p: number): string;
  dispose(): void;
}

export interface ShieldSceneOptions {
  quality: Quality;
  layout: Layout;
  /** fixed pixel size, for an offscreen canvas that has no layout box */
  size?: { width: number; height: number };
  /** called after every rendered frame with the anchors' positions in CSS pixels */
  onFrame?: (anchors: AnchorPoints) => void;
}

// panel-space anchor points (front face)
const ANCHORS: Record<AnchorName, [number, number]> = {
  up: [BUTTONS[0][0], BUTTONS[0][1]],
  down: [BUTTONS[1][0], BUTTONS[1][1]],
  panelTop: [PANEL_W * 0.3, PANEL_H / 2 - 0.1],
  panelLeft: [-PANEL_W / 2, 0],
  panelRight: [PANEL_W / 2, -0.2],
};

// ── camera shots: where the camera sits and what it looks at ──
interface Shot {
  pos: [number, number, number];
  at: [number, number, number];
}
const SHOTS: Record<"hero" | "heroIn" | "wide" | "close" | "bond" | "protect" | "verify", Shot> = {
  hero: { pos: [11, 0.8, 46], at: [-4.8, 1.8, 0] }, // opening: the lobby at night
  heroIn: { pos: [9.5, 0.6, 41], at: [-4.4, 1.6, 0] }, // a slow dolly while the opening is on screen
  wide: { pos: [3.8, 0.1, 18], at: [-1.4, 0.3, 0] }, // closer: the lift doors and the call panel beside them
  close: { pos: [-2.5, 0.15, 6.6], at: [0.15, -0.1, 0] }, // three-quarter view of the panel
  bond: { pos: [-2.1, 0.25, 6.1], at: [0.1, -0.05, 0] },
  protect: { pos: [-2.7, 0.05, 6.9], at: [0.1, -0.1, 0] },
  verify: { pos: [-3.9, 0.4, 9.4], at: [-0.6, 0, 0] },
};
// phones frame the panel in the top half, so every shot pulls back a little
const DISTANCE: Record<Layout, number> = { side: 1, top: 2.15, center: 1.12 };

export function createShieldScene(canvas: HTMLCanvasElement, opts: ShieldSceneOptions): ShieldScene {
  const { quality } = opts;
  let layout = opts.layout;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: quality === "high",
    powerPreference: "high-performance",
    preserveDrawingBuffer: Boolean(opts.size),
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.localClippingEnabled = true; // the bonded film is revealed by a clipping plane

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.sherpaDeep, 42, 110);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 140);

  // a soft studio environment, so the brushed steel has something to reflect
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.5;

  const hemi = new THREE.HemisphereLight(COLORS.orientTint, COLORS.sherpaDeep, 0.45);
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(-4, 5, 7);
  const rim = new THREE.PointLight(COLORS.turquoise, 18, 14);
  rim.position.set(3, -2, 2);
  scene.add(hemi, key, rim);
  const baseLights: [THREE.Light, number][] = [
    [hemi, hemi.intensity],
    [key, key.intensity],
    [rim, rim.intensity],
  ];

  const ctx = { quality };
  const lobby = createLobby(ctx);
  scene.add(lobby.group);
  const panel = createLiftPanel(ctx);
  scene.add(panel.group);
  const surfaceEffects: SceneObject[] = [createMist(ctx), createFilm(ctx), createGerms(ctx), createFingerprints(ctx)];
  surfaceEffects.forEach((o) => panel.surface.add(o.group));
  const field = createPlusField(ctx);
  scene.add(field.group);
  // the fly-through stream lives in camera space
  const stream = createParticleStream(ctx);
  camera.add(stream.group);
  // the dark of the opening: a curtain in front of the lobby, behind the particles, lifted by scrolling
  const curtainTex = voidTexture();
  const curtainGeo = new THREE.PlaneGeometry(80, 50);
  const curtainMat = new THREE.MeshBasicMaterial({
    map: curtainTex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const curtain = new THREE.Mesh(curtainGeo, curtainMat);
  curtain.position.z = -9;
  curtain.renderOrder = 5; // over the lobby, under the particles (10)
  curtain.frustumCulled = false;
  camera.add(curtain);
  scene.add(camera);
  const objects: SceneObject[] = [lobby, panel, field, stream, ...surfaceEffects];

  let p = 0;
  let width = 1;
  let height = 1;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

  function applyLayout() {
    camera.aspect = width / height;
    // shift the rendered image so the panel sits beside (desktop) or above (phones) the text
    if (layout === "side") camera.setViewOffset(width, height, -width * 0.15, 0, width, height);
    else if (layout === "top") camera.setViewOffset(width, height, 0, height * 0.24, width, height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }

  const maxDpr = quality === "high" ? 1.5 : 1.25;
  function resize() {
    const w = opts.size?.width ?? canvas.clientWidth;
    const h = opts.size?.height ?? canvas.clientHeight;
    // never size from an unlaid-out box (it would fall back to 300×150 and stretch); the
    // page's ResizeObserver calls resize() again once the stage has its real size
    if (!w || !h) return;
    width = w;
    height = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr)); // follows browser zoom
    renderer.setSize(width, height, false);
    applyLayout();
  }

  // ── camera path ──
  const posA = new THREE.Vector3();
  const posB = new THREE.Vector3();
  const atA = new THREE.Vector3();
  const atB = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const at = new THREE.Vector3();

  function shot(s: Shot, outPos: THREE.Vector3, outAt: THREE.Vector3, far: boolean) {
    outAt.set(...s.at);
    outPos.set(...s.pos);
    // pull back along the view line for the layout; wide shots barely need it (and would fog out)
    if (far) {
      const m = DISTANCE[layout];
      const d = outPos.distanceTo(outAt);
      const eff = d > 20 ? 1 + (m - 1) * 0.2 : m;
      outPos.sub(outAt).multiplyScalar(eff).add(outAt);
    }
  }

  function blend(a: Shot, b: Shot, t: number) {
    shot(a, posA, atA, true);
    shot(b, posB, atB, true);
    const k = smooth(t);
    pos.lerpVectors(posA, posB, k);
    at.lerpVectors(atA, atB, k);
  }

  function placeCamera(prog: number, time: number) {
    const pull = local(prog, "pullout");
    if (pull <= 0) blend(SHOTS.hero, SHOTS.heroIn, local(prog, "open"));
    else if (pull < 1) blend(SHOTS.heroIn, SHOTS.wide, pull);
    else if (local(prog, "ordinary") < 1) blend(SHOTS.wide, SHOTS.close, local(prog, "ordinary") / 0.45);
    else if (local(prog, "bond") <= 0) blend(SHOTS.close, SHOTS.close, 0);
    else if (local(prog, "bond") < 1) blend(SHOTS.close, SHOTS.bond, local(prog, "bond"));
    else if (local(prog, "protect") < 1) blend(SHOTS.bond, SHOTS.protect, local(prog, "protect"));
    else blend(SHOTS.protect, SHOTS.verify, local(prog, "verify"));

    // idle drift and pointer parallax (desktop), both small
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;
    const drift = quality === "high" ? 1 : 0.5;
    const settled = 1;
    camera.position.set(
      pos.x + Math.sin(time * 0.18) * 0.06 * drift + pointer.sx * 0.35 * settled,
      pos.y + Math.cos(time * 0.14) * 0.04 * drift - pointer.sy * 0.2 * settled,
      pos.z,
    );
    camera.lookAt(at);
  }

  // ── anchors → screen ──
  const tmp = new THREE.Vector3();
  const anchors: AnchorPoints = {};
  function projectAnchors() {
    for (const name of Object.keys(ANCHORS) as AnchorName[]) {
      const [x, y] = ANCHORS[name];
      tmp
        .set(x, y, FACE_Z + 0.06)
        .applyMatrix4(panel.surface.matrixWorld)
        .project(camera);
      anchors[name] = { x: ((tmp.x + 1) / 2) * width, y: ((1 - tmp.y) / 2) * height };
    }
    return anchors;
  }

  function renderAt(prog: number, time: number) {
    placeCamera(prog, time);
    // the room dims a little while the "+" stream passes, then comes back up on the lift
    const dim = 1 - 0.78 * streamEnvelope(prog);
    for (const [l, base] of baseLights) l.intensity = base * dim;
    scene.environmentIntensity = 0.5 * dim;
    for (const o of objects) o.update(prog, time);
    curtainMat.opacity = 1 - revealAt(prog);
    curtain.visible = curtainMat.opacity > 0.001;
    renderer.render(scene, camera);
    opts.onFrame?.(projectAnchors());
  }

  // frame loop, only while active
  let raf = 0;
  let active = false;
  const t0 = performance.now();
  const frame = (now: number) => {
    renderAt(p, (now - t0) / 1000);
    raf = requestAnimationFrame(frame);
  };

  resize();
  renderAt(0, 0);

  return {
    setProgress(next) {
      p = next;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    setLayout(next) {
      layout = next;
      applyLayout();
    },
    resize,
    setActive(on) {
      if (on && !active) {
        active = true;
        raf = requestAnimationFrame(frame);
      } else if (!on && active) {
        active = false;
        cancelAnimationFrame(raf);
      }
    },
    renderStill(target) {
      renderAt(target, 0);
      return canvas.toDataURL("image/jpeg", 0.86);
    },
    dispose() {
      cancelAnimationFrame(raf);
      active = false;
      objects.forEach((o) => o.dispose());
      curtainTex.dispose();
      curtainGeo.dispose();
      curtainMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
