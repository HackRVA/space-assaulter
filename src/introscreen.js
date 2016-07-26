import { Screen } from 'canvas-screens';
// import { Scene, PerspectiveCamera, MeshBasicMaterial, Mesh, 
//   WebGLRenderer, JSONLoader } from 'three';
import THREE from 'three';
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
const MeshBasicMaterial = THREE.MeshBasicMaterial;
const Mesh = THREE.Mesh;
const WebGLRenderer = THREE.WebGLRenderer;
const JSONLoader = THREE.JSONLoader;

export const IntroScreen = Object.create(Screen);

IntroScreen.init = function(target, gl) {
  Screen.init.call(this, target);
  this.scene = new Scene();

  // Creates a perspective camera with a 1 meter near plane and 10,000 meter far plane
  // positioned at 0, 0, 1000
  this.camera = new PerspectiveCamera( 0.75, target.width / target.height, 1, 10000);
  this.camera.position.z = 300;

  // Create a 200x200x200 meter red wireframe box
  this.renderer = new WebGLRenderer({
    "canvas": target,
    "context": gl
  });

  this.loader = new JSONLoader();
  this.loader.load(
    "resources/hackrva.json", 
    this.onLoad.bind(this), 
    this.onProgress.bind(this), 
    this.onError.bind(this));

  this.mesh = null;
}

IntroScreen.onLoad = function(geometry, materials) {
  var material = new MeshBasicMaterial( { 
    "color": 0xFF0000, 
    "wireframe": true} );
  this.mesh = new Mesh(geometry, material);
  this.scene.add(this.mesh);
}

IntroScreen.onError = function() {
  console.log("Failure while loading intro geometry");
}

IntroScreen.onProgress = function(xmlreq) {
}

IntroScreen.draw = function(currentTime) {
  Screen.draw.call(this, currentTime);
  this.renderer.render(this.scene, this.camera);
  if(this.mesh !== null && this.elapsedTime < Math.PI / (2 * 0.05)) {
    this.mesh.rotation.x = 0.05 * this.elapsedTime;
  }
}

