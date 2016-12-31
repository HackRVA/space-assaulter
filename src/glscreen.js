import { Screen } from 'canvas-screens';
import { Scene, PerspectiveCamera } from 'three';
/*
import THREE from 'three';
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
*/

export const GLScreen = Object.create(Screen);

GLScreen.init = function(renderer) {
  this.renderer = renderer;
  var target = renderer.domElement;
  // Use the domElement of the renderer
  Screen.init.call(this, target);
  // Internally has a scene and a camera
  this.scene = new Scene();
  // Creates a perspective camera with a 1 meter near plane and 10,000 meter far plane
  // positioned at 0, 0, 1000
  this.camera = new PerspectiveCamera( 3, target.width / target.height, 1, 10000);
};

GLScreen.draw = function(currentTime) {
  Screen.draw.call(this, currentTime);
  this.renderer.render(this.scene, this.camera);
};

GLScreen.getScene = function() {
  return this.scene;
};

GLScreen.getCamera = function() {
  return this.camera;
};

