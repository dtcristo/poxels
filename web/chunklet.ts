import {
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Geometry,
  Vector3,
  Face3,
  FaceColors
} from "three";
import { compact, zip, clone, sortBy, isEqual } from "lodash-es";

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
const A = 0;
const B = 1;
const C = 2;
const D = 3;
const E = 4;
const F = 5;
const G = 6;
const H = 7;
const I = 8;
const J = 9;
const K = 10;
const L = 11;
const M = 12;
const N = 13;

const VERTEX_NAME = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N"
];

const FACES: [number, number, number][][] = [
  // 0
  [
    [A, F, B],
    [A, E, F],
    [B, F, E],
    [A, B, E]
  ], // 1
  [
    [B, C, E],
    [B, G, C],
    [E, C, G],
    [E, G, B]
  ], // 2
  [
    [D, E, C],
    [D, H, E],
    [E, H, C],
    [D, C, H]
  ], // 3
  [
    [A, D, I],
    [A, I, E],
    [D, E, I],
    [A, E, D]
  ], // 4
  [
    [A, F, E],
    [A, E, I],
    [E, F, I],
    [A, I, F]
  ], // 5
  [
    [B, E, F],
    [E, G, F],
    [B, F, G],
    [G, E, B]
  ], // 6
  [
    [C, E, G],
    [C, H, E],
    [E, H, G],
    [C, G, H]
  ], // 7
  [
    [D, I, E],
    [D, H, I],
    [E, I, H],
    [D, E, H]
  ], // 8
  [
    [A, J, F],
    [A, I, J],
    [A, F, I],
    [J, I, F]
  ], // 9
  [
    [B, F, K],
    [B, K, G],
    [B, G, F],
    [F, G, K]
  ], // 10
  [
    [C, H, G],
    [H, L, G],
    [C, G, L],
    [C, L, H]
  ], // 11
  [
    [D, M, I],
    [D, H, M],
    [D, I, H],
    [I, M, H]
  ], // 12
  [
    [G, F, H],
    [F, I, H],
    [E, I, F],
    [E, H, I],
    [E, G, H],
    [E, F, G]
  ], // 13
  [
    [F, H, I],
    [F, G, H],
    [F, N, G],
    [G, N, H],
    [I, H, N],
    [I, N, F]
  ], // 14
  [
    [F, I, J],
    [F, J, N],
    [J, I, N],
    [F, N, I]
  ], // 15
  [
    [F, N, K],
    [K, N, G],
    [F, G, N],
    [F, K, G]
  ], // 16
  [
    [G, N, L],
    [G, H, N],
    [H, L, N],
    [G, L, H]
  ], // 17
  [
    [H, I, N],
    [H, M, I],
    [I, M, N],
    [M, H, N]
  ], // 18
  [
    [F, J, K],
    [F, N, J],
    [F, K, N],
    [J, N, K]
  ], // 19
  [
    [K, N, L],
    [G, K, L],
    [G, L, N],
    [G, N, K]
  ], // 20
  [
    [N, M, L],
    [H, M, N],
    [H, N, L],
    [H, L, M]
  ], // 21
  [
    [I, M, J],
    [M, N, J],
    [I, J, N],
    [I, N, M]
  ]
];

const EXTERNAL_MAP: {
  [sortedFace: string]: [number[], number];
} = {
  [sortBy([J, N, K]).toString()]: [sortBy([A, B, E]), 5],
  [sortBy([J, N, M]).toString()]: [sortBy([A, E, D]), 5],
  [sortBy([M, N, L]).toString()]: [sortBy([D, E, C]), 5],
  [sortBy([N, L, K]).toString()]: [sortBy([E, C, B]), 5],
  [sortBy([A, B, E]).toString()]: [sortBy([J, N, K]), 0],
  [sortBy([A, E, D]).toString()]: [sortBy([J, N, M]), 0],
  [sortBy([D, E, C]).toString()]: [sortBy([M, N, L]), 0],
  [sortBy([E, C, B]).toString()]: [sortBy([N, L, K]), 0],

  [sortBy([A, B, F]).toString()]: [sortBy([D, H, C]), 1],
  [sortBy([A, F, J]).toString()]: [sortBy([D, H, M]), 1],
  [sortBy([J, F, K]).toString()]: [sortBy([M, H, L]), 1],
  [sortBy([B, F, K]).toString()]: [sortBy([C, H, L]), 1],
  [sortBy([D, H, C]).toString()]: [sortBy([A, B, F]), 3],
  [sortBy([D, H, M]).toString()]: [sortBy([A, F, J]), 3],
  [sortBy([M, H, L]).toString()]: [sortBy([J, F, K]), 3],
  [sortBy([C, H, L]).toString()]: [sortBy([B, F, K]), 3],

  [sortBy([A, I, J]).toString()]: [sortBy([B, G, K]), 4],
  [sortBy([A, D, I]).toString()]: [sortBy([B, G, C]), 4],
  [sortBy([M, I, D]).toString()]: [sortBy([L, G, C]), 4],
  [sortBy([J, I, M]).toString()]: [sortBy([K, G, L]), 4],
  [sortBy([B, G, K]).toString()]: [sortBy([A, I, J]), 2],
  [sortBy([B, G, C]).toString()]: [sortBy([A, D, I]), 2],
  [sortBy([L, G, C]).toString()]: [sortBy([M, I, D]), 2],
  [sortBy([K, G, L]).toString()]: [sortBy([J, I, M]), 2]
};

const FULL_POXEL_MASK: boolean[] = Array(22).fill(true);
const EMPTY_POXEL_MASK: boolean[] = Array(22).fill(false);

function buildFaceMap() {
  const faceMap: {
    [key: string]: {
      innerPoxel: number;
      oppositePoxel: number;
      oppositeDirection?: number;
    };
  } = {};
  for (let i = 0; i < FACES.length; i++) {
    for (let j = 0; j < FACES[i].length; j++) {
      const oppositePoxel = poxelFromSortedFace(sortBy(FACES[i][j]), i);
      let result;
      if (oppositePoxel !== undefined) {
        result = { innerPoxel: i, oppositePoxel, oppositeDirection: undefined };
      } else {
        const [oppositeFaceSorted, oppositeDirection] = EXTERNAL_MAP[
          sortBy(FACES[i][j]).toString()
        ];
        result = {
          innerPoxel: i,
          oppositePoxel: poxelFromSortedFace(oppositeFaceSorted) ?? -1,
          oppositeDirection
        };
      }
      faceMap[FACES[i][j].toString()] = result;
    }
  }
  return faceMap;
}

function poxelFromSortedFace(sortedFace: number[], skipPoxel?: number) {
  let poxel: number | undefined;
  for (let x = 0; x < FACES.length; x++) {
    if (skipPoxel !== undefined && skipPoxel === x) continue;
    for (let y = 0; y < FACES[x].length; y++) {
      if (isEqual(sortBy(FACES[x][y]), sortedFace)) {
        poxel = x;
      }
    }
  }
  return poxel;
}

console.log(EXTERNAL_MAP);
const FACE_MAP = buildFaceMap();
console.log(FACE_MAP);

export default class Chunklet {
  geometry: Geometry;
  mesh: Mesh;
  poxelMask: boolean[];
  // selectedFaceIndex?: number;

  static buildWithPoxel(position: Vector3, poxel: number) {
    console.log("building chunklet");
    const initalPoxelMask: boolean[] = Array(22).fill(false);
    initalPoxelMask[poxel] = true;
    return new Chunklet(position, initalPoxelMask);
  }

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

  createAtFace(
    faceRaw: [number, number, number]
  ): undefined | { poxel: number; direction: number } {
    const { oppositePoxel, oppositeDirection } = FACE_MAP[faceRaw.toString()];
    if (oppositeDirection === undefined) {
      this.create(oppositePoxel);
      return;
    } else {
      return { poxel: oppositePoxel, direction: oppositeDirection };
    }
  }

  deleteAtFace(faceRaw: [number, number, number]): boolean {
    const targetPoxel = FACE_MAP[faceRaw.toString()].innerPoxel;
    return this.delete(targetPoxel);
  }

  create(poxel: number) {
    this.poxelMask[poxel] = true;
    this.setFaces();
  }

  delete(poxel: number): boolean {
    this.poxelMask[poxel] = false;
    if (isEqual(this.poxelMask, EMPTY_POXEL_MASK)) {
      return true;
    } else {
      this.setFaces();
      return false;
    }
  }

  // updateFaceSelection(faceIndex?: number) {
  //   if (faceIndex !== this.selectedFaceIndex) {
  //     for (let i = 0; i < this.geometry.faces.length; i++) {
  //       this.geometry.faces[i].color.setHex(0xffffff);
  //     }
  //     if (faceIndex !== undefined) {
  //       this.geometry.faces[faceIndex].color.setHex(0xff0000);
  //     }
  //     this.geometry.colorsNeedUpdate = true;
  //     this.selectedFaceIndex = faceIndex;
  //   }
  // }

  dispose() {
    console.log("disposing chunklet");
    this.geometry.dispose();
  }
}
