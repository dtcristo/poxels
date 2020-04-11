import {
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Geometry,
  Vector3,
  Face3,
  FaceColors
} from "three";
import { compact, zip, clone } from "lodash-es";

const A_V = [0, 0, 0];
const B_V = [1, 0, 0];
const C_V = [1, 0, 1];
const D_V = [0, 0, 1];
const E_V = [0.5, 0, 0.5];
const F_V = [0.5, 0.5, 0];
const G_V = [1, 0.5, 0.5];
const H_V = [0.5, 0.5, 1];
const I_V = [0, 0.5, 0.5];
const J_V = [0, 1, 0];
const K_V = [1, 1, 0];
const L_V = [1, 1, 1];
const M_V = [0, 1, 1];
const N_V = [0.5, 1, 0.5];

const VERTICES = [
  A_V,
  B_V,
  C_V,
  D_V,
  E_V,
  F_V,
  G_V,
  H_V,
  I_V,
  J_V,
  K_V,
  L_V,
  M_V,
  N_V
].map(v => new Vector3(...v));

// Vertex indices
const a = 0;
const b = 1;
const c = 2;
const d = 3;
const e = 4;
const f = 5;
const g = 6;
const h = 7;
const i = 8;
const j = 9;
const k = 10;
const l = 11;
const m = 12;
const n = 13;

const FACES = [
  // 0
  [
    [a, f, b],
    [a, e, f],
    [b, f, e],
    [a, b, e]
  ], // 1
  [
    [b, c, e],
    [b, g, c],
    [e, c, g],
    [e, g, b]
  ], // 2
  [
    [d, e, c],
    [d, h, e],
    [e, h, c],
    [d, c, h]
  ], // 3
  [
    [a, d, i],
    [a, i, e],
    [d, e, i],
    [a, e, d]
  ], // 4
  [
    [a, f, e],
    [a, e, i],
    [e, f, i],
    [a, i, f]
  ], // 5
  [
    [b, e, f],
    [e, g, f],
    [b, f, g],
    [g, e, b]
  ], // 6
  [
    [c, e, g],
    [c, h, e],
    [e, h, g],
    [c, g, h]
  ], // 7
  [
    [d, i, e],
    [d, h, i],
    [e, i, h],
    [d, e, h]
  ], // 8
  [
    [a, j, f],
    [a, i, j],
    [a, f, i],
    [j, i, f]
  ], // 9
  [
    [b, f, k],
    [b, k, g],
    [b, g, f],
    [f, g, k]
  ], // 10
  [
    [c, h, g],
    [h, l, g],
    [c, g, l],
    [c, l, h]
  ], // 11
  [
    [d, m, i],
    [d, h, m],
    [d, i, h],
    [i, m, h]
  ], // 12
  [
    [g, f, h],
    [f, i, h],
    [e, i, f],
    [e, h, i],
    [e, g, h],
    [e, f, g]
  ], // 13
  [
    [f, h, i],
    [f, g, h],
    [f, n, g],
    [g, n, h],
    [i, h, n],
    [i, n, f]
  ], // 14
  [
    [f, i, j],
    [f, j, n],
    [j, i, n],
    [f, n, i]
  ], // 15
  [
    [f, n, k],
    [k, n, g],
    [f, g, n],
    [f, k, g]
  ], // 16
  [
    [g, n, l],
    [g, h, n],
    [h, l, n],
    [g, l, h]
  ], // 17
  [
    [h, i, n],
    [h, m, i],
    [i, m, n],
    [m, h, n]
  ], // 18
  [
    [f, j, k],
    [f, n, j],
    [f, k, n],
    [j, n, k]
  ], // 19
  [
    [k, n, l],
    [g, k, l],
    [g, l, n],
    [g, n, k]
  ], // 20
  [
    [n, m, l],
    [h, m, n],
    [h, n, l],
    [h, l, m]
  ], // 21
  [
    [i, m, j],
    [m, n, j],
    [i, j, n],
    [i, n, m]
  ]
];

const FULL_POXEL_MASK: boolean[] = Array(22).fill(true);

function buildFaceMap() {
  const faceMap: {
    [key: string]: number;
  } = {};
  for (let i = 0; i < FACES.length; i++) {
    for (let j = 0; j < FACES[i].length; j++) {
      faceMap[FACES[i][j].toString()] = i;
    }
  }
  return faceMap;
}

const FACE_MAP = buildFaceMap();

export default class Chunklet {
  geometry: Geometry;
  mesh: Mesh;
  poxelMask: boolean[];
  selectedFaceIndex?: number;

  constructor(
    position: Vector3,
    poxelMask: boolean[] = clone(FULL_POXEL_MASK)
  ) {
    this.poxelMask = poxelMask;

    this.geometry = new Geometry();
    this.geometry.vertices = VERTICES;
    this.setFaces();
    // this.geometry.computeVertexNormals();

    const material = new MeshNormalMaterial({ flatShading: true });
    // const material = new MeshNormalMaterial();
    // const material = new MeshBasicMaterial({ vertexColors: FaceColors });

    this.mesh = new Mesh(this.geometry, material);
    this.mesh.position.copy(position);
  }

  setFaces() {
    this.geometry.faces = compact(
      zip(this.poxelMask, FACES).map(([present, faces]) => present && faces)
    )
      .flat()
      .map(face => new Face3(face[0], face[1], face[2]));
    this.geometry.elementsNeedUpdate = true;
  }

  deleteAtFace(faceRaw: [number, number, number]) {
    this.poxelMask[FACE_MAP[faceRaw.toString()]] = false;
    this.setFaces();
  }

  updateFaceSelection(faceIndex?: number) {
    if (faceIndex !== this.selectedFaceIndex) {
      for (let i = 0; i < this.geometry.faces.length; i++) {
        this.geometry.faces[i].color.setHex(0xffffff);
      }
      if (faceIndex !== undefined) {
        this.geometry.faces[faceIndex].color.setHex(0xff0000);
      }
      this.geometry.colorsNeedUpdate = true;
      this.selectedFaceIndex = faceIndex;
    }
  }
}
