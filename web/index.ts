import init from "../pkg";
import World from "./world";
import "./style.scss";

init("poxel_bg.wasm");

const world = new World();
world.animate();
