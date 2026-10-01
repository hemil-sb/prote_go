import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { COLORS, claddingTextures, displayTexture } from "../textures";
import type { Layout, ObjectContext, SceneObject } from "../types";

/*
  The real space around the panel: a lift lobby at night ("protection that doesn't sleep").
  Teal micro-cement cladding in large panels with shadow-gap joints, slatted panelling to the
  right, brushed-steel lift doors in a steel frame to the left with a floor indicator above,
  a steel crash rail along the wall, a polished stone floor, and downlights throwing pools of
  light onto the wall.

  World units follow the panel (3.3 units ≈ a 40 cm call panel, so ~8 units ≈ 1 m).
*/

const FLOOR_Y = -9.2;
const CEIL_Y = 14;
const WALL_Z = -0.14;
const DOOR_L = -13;
const DOOR_R = -3.2;
const DOOR_TOP = 8.7;
// cladding: 600 × 1200 mm panels, laid so no joint crosses the call panel (which spans x ±0.8, y ±1.6)
const TILE_W = 4.8;
const TILE_H = 9.6;
const TILE_X0 = 2.8; // a vertical joint here and at -2.0: perspective lines either side of the panel
const TILE_Y0 = -2.9; // a horizontal joint just under the rail
// crash rail: about 85 cm up the wall
const RAIL_Y = -2.3;

export type Lobby = SceneObject;

export function createLobby(ctx: ObjectContext): Lobby {
  const high = ctx.quality === "high";
  const group = new THREE.Group();
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);
  const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(keep(new THREE.BoxGeometry(w, h, d)), mat);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  };

  // wall: cladding with a normal map; UVs are in world units so the tile grid runs continuously
  // across the three pieces around the door opening
  const { map, normalMap } = claddingTextures(high ? 512 : 256);
  keep(map);
  keep(normalMap);
  const wallMat = keep(
    new THREE.MeshStandardMaterial({
      color: "#18555f",
      map,
      normalMap,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughness: 0.78,
      metalness: 0,
    }),
  );
  const wallPiece = (x0: number, x1: number, y0: number, y1: number) => {
    const geo = keep(new THREE.PlaneGeometry(x1 - x0, y1 - y0));
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (pos.getX(i) + cx - TILE_X0) / TILE_W, (pos.getY(i) + cy - TILE_Y0) / TILE_H);
    }
    uv.needsUpdate = true;
    const w = new THREE.Mesh(geo, wallMat);
    w.position.set(cx, cy, WALL_Z);
    group.add(w);
  };
  wallPiece(-45, DOOR_L - 0.6, FLOOR_Y, CEIL_Y);
  wallPiece(DOOR_R + 0.6, 45, FLOOR_Y, CEIL_Y);
  wallPiece(DOOR_L - 0.6, DOOR_R + 0.6, DOOR_TOP + 0.6, CEIL_Y);

  // slatted panelling to the right of the panel
  const slatMat = keep(new THREE.MeshStandardMaterial({ color: COLORS.orientDeep, roughness: 0.55, metalness: 0.15 }));
  const slats = high ? 34 : 22;
  const slatGeo = keep(new THREE.BoxGeometry(0.34, CEIL_Y - FLOOR_Y, 0.34));
  const slatMesh = new THREE.InstancedMesh(slatGeo, slatMat, slats);
  const m = new THREE.Matrix4();
  for (let i = 0; i < slats; i++) {
    m.makeTranslation(4.2 + i * 0.64, (CEIL_Y + FLOOR_Y) / 2, WALL_Z + 0.18);
    slatMesh.setMatrixAt(i, m);
  }
  group.add(slatMesh);

  // lift doors in a steel frame, to the left of the panel: a little darker and warmer than
  // the call panel's plate, so the door edge reads as its own material in the close shots
  const steel = keep(new THREE.MeshPhysicalMaterial({ color: "#9cb0b5", metalness: 1, roughness: 0.36, anisotropy: 0.85, clearcoat: 0.2 }));
  const frameMat = keep(new THREE.MeshStandardMaterial({ color: "#84979c", metalness: 1, roughness: 0.26 }));
  const doorH = DOOR_TOP - FLOOR_Y;
  const doorW = DOOR_R - DOOR_L;
  box(0.6, doorH + 0.6, 0.5, frameMat, DOOR_L - 0.3, FLOOR_Y + (doorH + 0.6) / 2, WALL_Z + 0.2);
  box(0.6, doorH + 0.6, 0.5, frameMat, DOOR_R + 0.3, FLOOR_Y + (doorH + 0.6) / 2, WALL_Z + 0.2);
  box(doorW + 1.2, 0.6, 0.5, frameMat, (DOOR_L + DOOR_R) / 2, DOOR_TOP + 0.3, WALL_Z + 0.2);
  const leafW = doorW / 2 - 0.05;
  box(leafW, doorH, 0.14, steel, DOOR_L + leafW / 2, FLOOR_Y + doorH / 2, WALL_Z - 0.25);
  box(leafW, doorH, 0.14, steel, DOOR_R - leafW / 2, FLOOR_Y + doorH / 2, WALL_Z - 0.25);
  // recess behind the doors
  box(
    doorW,
    doorH,
    0.1,
    keep(new THREE.MeshStandardMaterial({ color: "#050f12", roughness: 1 })),
    (DOOR_L + DOOR_R) / 2,
    FLOOR_Y + doorH / 2,
    WALL_Z - 0.45,
  );

  // floor indicator above the doors
  const indTex = keep(displayTexture());
  const indicator = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(2.8, 0.7)),
    keep(new THREE.MeshBasicMaterial({ map: indTex, toneMapped: false })),
  );
  indicator.position.set((DOOR_L + DOOR_R) / 2, DOOR_TOP + 1.75, WALL_Z + 0.06);
  const indFrame = new THREE.Mesh(keep(new RoundedBoxGeometry(3.1, 1.0, 0.08, 3, 0.06)), frameMat);
  indFrame.position.set((DOOR_L + DOOR_R) / 2, DOOR_TOP + 1.75, WALL_Z + 0.01);
  group.add(indFrame, indicator);

  // crash rail: brushed steel, either side of the doors, stopping before the slats
  const railMat = keep(new THREE.MeshStandardMaterial({ color: "#a3b4b8", metalness: 1, roughness: 0.3 }));
  const rail = (x0: number, x1: number) => box(x1 - x0, 0.36, 0.28, railMat, (x0 + x1) / 2, RAIL_Y, WALL_Z + 0.33);
  const rails = [rail(DOOR_R + 0.9, 3.9), rail(-45, DOOR_L - 0.9)];

  // floor: polished dark stone; skirting; ceiling
  const floor = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(90, 70)),
    keep(new THREE.MeshPhysicalMaterial({ color: "#0a2126", roughness: 0.2, metalness: 0.15, clearcoat: 0.9, clearcoatRoughness: 0.15 })),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR_Y, WALL_Z + 35);
  group.add(floor);
  box(90, 0.5, 0.25, keep(new THREE.MeshStandardMaterial({ color: "#0a262c", roughness: 0.6 })), 0, FLOOR_Y + 0.25, WALL_Z + 0.12);
  const ceiling = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(90, 70)),
    keep(new THREE.MeshStandardMaterial({ color: "#071a1e", roughness: 1 })),
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, CEIL_Y, WALL_Z + 35);
  group.add(ceiling);

  // downlights: a glowing disc on the ceiling and a soft spot washing the wall below it.
  // The one above the call panel is always there; it is what gives the close shots their sheen.
  const discMat = keep(new THREE.MeshBasicMaterial({ color: "#fff6ea", toneMapped: false }));
  const discGeo = keep(new THREE.CircleGeometry(0.45, 32));
  const spots = high ? [(DOOR_L + DOOR_R) / 2, 0.4, 11] : [(DOOR_L + DOOR_R) / 2, 0.4];
  for (const x of spots) {
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = Math.PI / 2;
    disc.position.set(x, CEIL_Y - 0.02, 3.2);
    group.add(disc);
    const spot = new THREE.SpotLight("#fff1e0", 170, 42, 0.44, 0.85, 1.1);
    spot.position.set(x, CEIL_Y - 0.4, 3.2);
    spot.target.position.set(x, -1.5, WALL_Z);
    group.add(spot, spot.target);
  }

  return {
    group,
    update() {},
    // phones frame the panel in the top half of the screen with the chapter text below; the rail
    // would run as a bright band straight behind that text, so it only shows in the other layouts
    setLayout(layout: Layout) {
      rails.forEach((r) => (r.visible = layout !== "top"));
    },
    dispose() {
      slatMesh.dispose();
      disposables.forEach((d) => d.dispose());
    },
  };
}
