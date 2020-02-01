import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class World {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  scene: THREE.Scene;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(45, this.aspect(), 1, 1000);
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.scene = new THREE.Scene();

    const grid = new THREE.GridHelper(100, 100, 0xff0000, 0x00ff00);
    this.scene.add(grid);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0.5, 0.5, 0.5);
    this.scene.add(cube);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
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
