import THREE from 'three';
const Mesh = THREE.Mesh;
const Object3D = THREE.Object3D;
import { Base } from 'canvas-screens';

// A trick for making Meshes asynchronously
// Overall, so long as we check that the loader finishes first, this makes
// things easier.
export const FutureMesh = Object.create(Mesh.prototype);

FutureMesh.create = Base.create;

FutureMesh.init = function(url, loader) {
  Mesh.call(this);
  this.userData = {
    "ready": false
  };
  loader.load(url, (function(geometry, materials) {
    this.geometry = geometry;
    this.material = materials[0];
    this.userData.ready = true;
  }).bind(this));
};

FutureMesh.isReady = function() {
  return this.userData.ready;
};

