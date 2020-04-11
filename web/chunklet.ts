import {
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Geometry,
  Vector3,
  Face3,
  FaceColors
} from "three";
import compact from "lodash-es/compact";

export default class Chunklet {
  geometry: Geometry;
  mesh: Mesh;
  poxelMask: boolean[];
  selectedFaceIndex?: number;
  stale: boolean;

  constructor(position: Vector3) {
    this.stale = false;
    this.poxelMask = Array(22);

    for (let i = 0; i < this.poxelMask.length; i++) {
      if (i < 11) {
        this.poxelMask[i] = true;
      } else {
        this.poxelMask[i] = false;
      }
    }

    this.geometry = new Geometry();

    const a_v = [0, 0, 0];
    const b_v = [1, 0, 0];
    const c_v = [1, 0, 1];
    const d_v = [0, 0, 1];
    const e_v = [0.5, 0, 0.5];
    const f_v = [0.5, 0.5, 0];
    const g_v = [1, 0.5, 0.5];
    const h_v = [0.5, 0.5, 1];
    const i_v = [0, 0.5, 0.5];
    const j_v = [0, 1, 0];
    const k_v = [1, 1, 0];
    const l_v = [1, 1, 1];
    const m_v = [0, 1, 1];
    const n_v = [0.5, 1, 0.5];

    const verticesRaw = [
      a_v,
      b_v,
      c_v,
      d_v,
      e_v,
      f_v,
      g_v,
      h_v,
      i_v,
      j_v,
      k_v,
      l_v,
      m_v,
      n_v
    ];

    this.geometry.vertices = verticesRaw.map(v => new Vector3(...v));
    this.geometry.faces = this.buildFaces();
    // this.geometry.computeVertexNormals();

    const material = new MeshNormalMaterial({ flatShading: true });
    // const material = new MeshBasicMaterial({ vertexColors: FaceColors });

    this.mesh = new Mesh(this.geometry, material);
    this.mesh.position.copy(position);
  }

  buildFaces(): Face3[] {
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

    const facesRaw = compact([
      // 0
      this.poxelMask[0] && [
        [a, f, b],
        [a, e, f],
        [b, f, e],
        [a, b, e]
      ],
      // 1
      this.poxelMask[1] && [
        [b, c, e],
        [b, g, c],
        [e, c, g],
        [e, g, b]
      ],
      // 2
      this.poxelMask[2] && [
        [d, e, c],
        [d, h, e],
        [e, h, c],
        [d, c, h]
      ],
      // 3
      this.poxelMask[3] && [
        [a, d, i],
        [a, i, e],
        [d, e, i],
        [a, e, d]
      ],
      // 4
      this.poxelMask[4] && [
        [a, f, e],
        [a, e, i],
        [e, f, i],
        [a, i, f]
      ],
      // 5
      this.poxelMask[5] && [
        [b, e, f],
        [e, g, f],
        [b, f, g],
        [g, e, b]
      ],
      // 6
      this.poxelMask[6] && [
        [c, e, g],
        [c, h, e],
        [e, h, g],
        [c, g, h]
      ],
      // 7
      this.poxelMask[7] && [
        [d, i, e],
        [d, h, i],
        [e, i, h],
        [d, e, h]
      ],
      // 8
      this.poxelMask[8] && [
        [a, j, f],
        [a, i, j],
        [a, f, i],
        [j, i, f]
      ],
      // 9
      this.poxelMask[9] && [
        [b, f, k],
        [b, k, g],
        [b, g, f],
        [f, g, k]
      ],
      // 10
      this.poxelMask[10] && [
        [c, h, g],
        [h, l, g],
        [c, g, l],
        [c, l, h]
      ],
      // 11
      this.poxelMask[11] && [
        [d, m, i],
        [d, h, m],
        [d, i, h],
        [i, m, h]
      ],
      // 12
      this.poxelMask[12] && [
        [f, i, j],
        [f, j, n],
        [j, i, n],
        [f, n, i]
      ],
      // 13
      this.poxelMask[13] && [
        [f, n, k],
        [k, n, g],
        [f, g, n],
        [f, k, g]
      ],
      // 14
      this.poxelMask[14] && [
        [g, n, l],
        [g, h, n],
        [h, l, n],
        [g, l, h]
      ],
      // 15
      this.poxelMask[15] && [
        [h, i, n],
        [h, m, i],
        [i, m, n],
        [m, h, n]
      ],
      // 16
      this.poxelMask[16] && [
        [f, j, k],
        [f, n, j],
        [f, k, n],
        [j, n, k]
      ],
      // 17
      this.poxelMask[17] && [
        [k, n, l],
        [g, k, l],
        [g, l, n],
        [g, n, k]
      ],
      // 18
      this.poxelMask[18] && [
        [n, m, l],
        [h, m, n],
        [h, n, l],
        [h, l, m]
      ],
      // 19
      this.poxelMask[19] && [
        [i, m, j],
        [m, n, j],
        [i, j, n],
        [i, n, m]
      ],
      // 20
      this.poxelMask[20] && [
        [g, f, h],
        [f, i, h],
        [e, i, f],
        [e, h, i],
        [e, g, h],
        [e, f, g]
      ],
      // 21
      this.poxelMask[21] && [
        [f, h, i],
        [f, g, h],
        [f, n, g],
        [g, n, h],
        [i, h, n],
        [i, n, f]
      ]
    ]).flat();

    return facesRaw.map(f => new Face3(f[0], f[1], f[2]));
  }

  update() {
    if (this.stale) {
      this.geometry.faces = this.buildFaces();
      this.geometry.elementsNeedUpdate = true;
      this.stale = false;
    }
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
