import {
  BoxGeometry,
  GridHelper,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class World {
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  scene: Scene;

  constructor() {
    this.camera = new PerspectiveCamera(45, this.aspect(), 1, 1000);
    this.camera.position.set(-3, 3, -3);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;

    this.scene = new Scene();

    const grid = new GridHelper(100, 100, 0xff0000, 0x00ff00);
    this.scene.add(grid);

    const geometry = new BufferGeometry();

    const a_v = [0, 0, 0]
    const b_v = [1, 0, 0]
    const c_v = [1, 0, 1]
    const d_v = [0, 0, 1]
    const e_v = [0.5, 0, 0.5]
    const f_v = [0.5, 0.5, 0]
    const g_v = [1, 0.5, 0.5]
    const h_v = [0.5, 0.5, 1]
    const i_v = [0, 0.5, 0.5]
    const j_v = [0, 1, 0]
    const k_v = [1, 1, 0]
    const l_v = [1, 1, 1]
    const m_v = [0, 1, 1]
    const n_v = [0.5, 1, 0.5]

    const vertices = new Float32Array([a_v,b_v,c_v,d_v,e_v,f_v,g_v,h_v,i_v,j_v,k_v,l_v,m_v,n_v].flat());

    const a = 0
    const b = 1
    const c = 2
    const d = 3
    const e = 4
    const f = 5
    const g = 6
    const h = 7
    const i = 8
    const j = 9
    const k = 10
    const l = 11
    const m = 12
    const n = 13

    const indices = [
      //1
      a,f,b,
      a,e,f,
      b,f,e,
      a,b,e,
      //2
      b,c,e,
      b,g,c,
      e,c,g,
      e,g,b,
      //3
      d,e,c,
      d,h,e,
      e,h,c,
      d,c,h,
      //4
      a,d,i,
      a,i,e,
      d,e,i,
      a,e,d,
      //5
      a,f,e,
      a,e,i,
      e,f,i,
      a,i,f,
      //6
      b,e,f,
      e,g,f,
      b,f,g,
      g,e,b,
      //7
      c,e,g,
      c,h,e,
      e,h,g,
      c,g,h,
      //8
      d,i,e,
      d,h,i,
      e,i,h,
      d,e,h,
      //9
      a,j,f,
      a,i,j,
      a,f,i,
      j,i,f,
      //10
      b,f,k,
      b,k,g,
      b,g,f,
      f,g,k,
      //11
      c,h,g,
      h,l,g,
      c,g,l,
      c,l,h,
      //12
      d,m,i,
      d,h,m,
      d,i,h,
      i,m,h,
      //13
      f,i,j,
      f,j,n,
      j,i,n,
      f,n,i,
      //14
      f,n,k,
      k,n,g,
      f,g,n,
      f,k,g,
      //15
      g,n,l,
      g,h,n,
      h,l,n,
      g,l,h,
      //16
      h,i,n,
      h,m,i,
      i,m,n,
      m,h,n,
      //17
      f,j,k,
      f,n,j,
      f,k,n,
      j,n,k,
      //18
      k,n,l,
      g,k,l,
      g,l,n,
      g,n,k,
      //19
      n,m,l,
      h,m,n,
      h,n,l,
      h,l,m,
      //20
      i,m,j,
      m,n,j,
      i,j,n,
      i,n,m,
      //21
      g,f,h,
      f,i,h,
      e,i,f,
      e,h,i,
      e,g,h,
      e,f,g,
      //22
      f,h,i,
      f,g,h,
      f,n,g,
      g,n,h,
      i,h,n,
      i,n,f,
    ].flat();

    geometry.setIndex(indices);
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    const material = new MeshNormalMaterial({ flatShading: true });
    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.animate = this.animate.bind(this);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  aspect() {
    return window.innerWidth / window.innerHeight;
  }

  onWindowResize(_event: UIEvent) {
    this.camera.aspect = this.aspect();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
