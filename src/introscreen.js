import { Screen } from 'canvas-screens';
// import { Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, 
//   WebGLRenderer } from 'three';
import THREE from 'three';
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
const BoxGeometry = THREE.BoxGeometry;
const MeshBasicMaterial = THREE.MeshBasicMaterial;
const Mesh = THREE.Mesh;
const WebGLRenderer = THREE.WebGLRenderer;

export const IntroScreen = Object.create(Screen);

IntroScreen.init = function(target, gl) {
  Screen.init.call(this, target);
  this.scene = new Scene();

  // Creates a perspective camera with a 1 meter near plane and 10,000 meter far plane
  // positioned at 0, 0, 1000
  this.camera = new PerspectiveCamera( 75, target.width / target.height, 1, 10000);
  this.camera.position.z = 1000;

  // Create a 200x200x200 meter red wireframe box
  var geometry = new BoxGeometry(200, 200, 200);
  var material = new MeshBasicMaterial( { 
    "color": 0xFF0000, 
    "wireframe": true} );
  this.scene.add(new Mesh(geometry, material))

  this.renderer = new WebGLRenderer({
    "context": gl
  });
}

IntroScreen.draw = function(currentTime) {
  Screen.draw.call(this, currentTime);
  this.renderer.render(this.scene, this.camera);
}

