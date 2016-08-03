import THREE from 'three';
const Mesh = THREE.Mesh;
const Object3D = THREE.Object3D;
const MeshLambertMaterial = THREE.MeshLambertMaterial;
import { Base } from 'canvas-screens';

// A trick for making Meshes asynchronously
// Overall, so long as we check that the loader finishes first, this makes
// things easier.
export const FutureMesh = Object.create(Mesh.prototype);

FutureMesh.create = Base.create;

FutureMesh.init = function(url, loader, callback) {
  this.callback = callback;
  Mesh.call(this);
  this.userData = {
    "ready": false
  };
  loader.load(url, (function(geometry, materials) {
    this.geometry = geometry;
    if(materials === undefined)
      this.material = new MeshLambertMaterial({"color": 0xFFFFFF});
    else
      this.material = materials[0];
    this.userData.ready = true;
    if(this.callback)
      this.callback();
  }).bind(this));
};

FutureMesh.isReady = function() {
  return this.userData.ready;
};

