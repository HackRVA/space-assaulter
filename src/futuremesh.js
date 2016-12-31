import { Base } from 'canvas-screens';
import { Mesh, MeshLambertMaterial } from 'three';
/*
import THREE from 'three';
const Mesh = THREE.Mesh;
const MeshLambertMaterial = THREE.MeshLambertMaterial;
*/

// A trick for making Meshes asynchronously
// Overall, so long as we check that the loader finishes first, this makes
// things easier.
export const FutureMesh = Object.create(Mesh.prototype);

FutureMesh.create = Base.create;

FutureMesh.init = function(url, loader, tex_url, tex_loader) {
  this.url = url;
  this.loader = loader;
  Mesh.call(this);
  this.userData = {
    "ready": false
  };
  this.loader.load(url, (function(geometry) {
    this.geometry = geometry;
    this.userData.ready = true;
  }).bind(this));
  if(tex_url && tex_loader) {
    this.tex_url = tex_url;
    this.tex_loader = tex_loader;
    tex_loader.load(tex_url, (function(texture) {
      this.texture = texture;
      this.material = new MeshLambertMaterial({"map": texture});
    }).bind(this));
  } else {
    this.material = new MeshLambertMaterial({"color": 0xFFFFFF});
  }
};

FutureMesh.clone = function(recursive) {
  return (this.userData.ready)? 
    Mesh.prototype.clone.call(this, recursive) : 
    FutureMesh.create(this.url, this.loader, this.tex_url, this.tex_loader);
};

FutureMesh.isReady = function() {
  return this.userData.ready;
};

