import { NestingScreen } from './nestingscreen.js';
import THREE from 'three';
const Scene = THREE.Scene;
const Raycaster = THREE.Raycaster;
const PerspectiveCamera = THREE.PerspectiveCamera;
const DirectionalLight = THREE.DirectionalLight;
const AmbientLight = THREE.AmbientLight;
import { Screen } from 'canvas-screens';
import { GLScreen } from './glscreen.js';

export const MenuScreen = Object.create(NestingScreen);

// Options are in the third dimension now
// Use a raycaster to determine whether an option is highlighted
MenuScreen.init = function(renderer, meshes) {
  NestingScreen.init.call(this, renderer);

  this.meshes = meshes;
  this.raycaster = new Raycaster();
  this.scene.add(new DirectionalLight(0xFFFFFF, 0.5));
  this.scene.add(new AmbientLight(0xFFFFFF, 0.2));
  // this.addHandler(this.target, "");
}

MenuScreen.open = function(graph) {
  NestingScreen.open.call(this, graph);
  graph.rebaseStack();

  console.log(this.meshes[0]);
  this.meshes[0].position.z = -500;
  this.scene.add(this.meshes[0]);
}

