import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Raycaster,
  Vector2,
  Vector3
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import flattenDeep from "lodash-es/flattenDeep";
import compact from "lodash-es/compact";
import Chunklet from "./chunklet";

const X_SIZE = 10;
const Y_SIZE = 10;
const Z_SIZE = 10;

export default class World {
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  scene: Scene;
  stats: Stats;
  chunkletGrid: Array<Array<Array<Chunklet | undefined>>>;
  raycaster: Raycaster;
  mouse?: Vector2;
  selectedChunk?: Vector3;

  constructor() {
    this.camera = new PerspectiveCamera(45, this.aspect(), 1, 1000);
    this.camera.position.set(-10, 10, -10);

    this.renderer = new WebGLRenderer({ antialias: true });
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.stats = Stats();
    document.body.appendChild(this.stats.domElement);

    this.raycaster = new Raycaster();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new Vector3(5, 0, 5);
    // this.controls.autoRotate = true;

    this.scene = new Scene();

    // const grid = new GridHelper(10, 10, 0xff0000, 0x00ff00);
    // grid.position.copy(new Vector3(5, 0, 5));
    // this.scene.add(grid);

    this.chunkletGrid = new Array(X_SIZE);
    for (let x = 0; x < X_SIZE; x++) {
      this.chunkletGrid[x] = new Array(Y_SIZE);
      for (let y = 0; y < Y_SIZE; y++) {
        this.chunkletGrid[x][y] = new Array(Z_SIZE);
        for (let z = 0; z < Z_SIZE; z++) {
          if (x === 5 && y === 0 && z === 5) {
            this.chunkletGrid[x][y][z] = new Chunklet(new Vector3(x, y, z));
          }
        }
      }
    }

    for (const chunklet of this.chunklets()) {
      this.scene.add(chunklet.mesh);
    }

    window.addEventListener("resize", this.onViewportChange.bind(this), false);
    matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addListener(
      this.onViewportChange.bind(this)
    );
    window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    window.addEventListener("mouseout", this.onMouseOut.bind(this), false);
    this.animate = this.animate.bind(this);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.update();
    this.render();
  }

  update() {
    if (this.mouse) {
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const objects = [];
      for (const chunklet of this.chunklets()) {
        objects.push(chunklet.mesh);
        chunklet.updateFaceSelection(undefined);
      }

      const intersections = this.raycaster.intersectObjects(objects);
      if (intersections.length > 0) {
        const position = intersections[0].object.position;
        const chunklet = this.chunkletGrid[position.x][position.y][position.z];
        const faceIndex = intersections[0].faceIndex;
        if (chunklet !== undefined && faceIndex !== undefined) {
          chunklet.updateFaceSelection(faceIndex);
        }
      }
    }

    // for (const chunklet of this.chunklets()) {
    //   chunklet.update();
    // }
    this.controls.update();
    this.stats.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  aspect() {
    return window.innerWidth / window.innerHeight;
  }

  onViewportChange() {
    this.camera.aspect = this.aspect();
    this.camera.updateProjectionMatrix();
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event: MouseEvent) {
    this.mouse = new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  }

  onMouseOut(_event: MouseEvent) {
    this.mouse = undefined;
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.onMouseMove(event);

    if (this.mouse !== undefined) {
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const objects = [];
      for (const chunklet of this.chunklets()) {
        objects.push(chunklet.mesh);
      }

      const intersections = this.raycaster.intersectObjects(objects);
      if (intersections.length > 0) {
        const position = intersections[0].object.position;
        const chunklet = this.chunkletGrid[position.x][position.y][position.z];
        const faceIndex = intersections[0].faceIndex;
        if (chunklet && faceIndex) {
          // chunklet.deleteAtFace(faceIndex);
        }
      }
    }
  }

  chunklets(): Chunklet[] {
    return compact(flattenDeep(this.chunkletGrid));
  }
}
