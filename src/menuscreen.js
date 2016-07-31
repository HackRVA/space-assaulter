import { ClickScreen } from './clickscreen.js';
import THREE from 'three';
const Scene = THREE.Scene;
const Raycaster = THREE.Raycaster;
const PerspectiveCamera = THREE.PerspectiveCamera;
const DirectionalLight = THREE.DirectionalLight;
const AmbientLight = THREE.AmbientLight;
const Vector2 = THREE.Vector2;
import { Screen } from 'canvas-screens';
import { GLScreen } from './glscreen.js';

export const MenuScreen = Object.create(ClickScreen);

// Options are in the third dimension now
// Use a raycaster to determine whether an option is highlighted

// Use bounding boxes to define spaces to click to navigate to another screen
// Use meshes to display
MenuScreen.init = function(renderer, options, aesthetic_meshes) {
  ClickScreen.init.call(this, renderer, options);
  this.meshes = (aesthetic_meshes === undefined)? []: aesthetic_meshes;

  this.scene.add(new DirectionalLight(0xFFFFFF, 0.5));
  this.scene.add(new AmbientLight(0xFFFFFF, 0.2));

  for(var c = 0; c < this.aesthetic_meshes.length; c++)
    this.scene.add(this.aesthetic_meshes[c]);
};

MenuScreen.open = function(graph) {
  ClickScreen.open.call(this, graph);
  graph.rebaseStack();
};

