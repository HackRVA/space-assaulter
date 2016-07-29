import { Screen } from 'canvas-screens';
import THREE from 'three';
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
const Raycaster = THREE.Raycaster;

const MenuScreen = Object.create(Screen);

// Options are in the third dimension now
// Use a raycaster to determine whether an option is highlighted
MenuScreen.init = function(target, ctx) {
  this.raycaster = new Raycaster();
  this.addHandler(this.target, "");
}

