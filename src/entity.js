import { Base } from 'canvas-screens';
import THREE from 'three';
const Object3D = THREE.Object3D;

// Could be a problem depending on how Object3D is defined
export const Entity = Object.create(Object3D.prototype);

Entity.create = Base.create;

Entity.init = function(mesh, bbox) {
  Object3D.call(this);
  this.mesh = mesh;
  this.bbox = (bbox === undefined)? mesh : bbox;
  this.add(this.mesh);
  this.add(this.bbox);
};

Entity.clone = function() {
  return Entity.create(this.mesh.clone(), this.bbox.clone());
};

Entity.getBBox = function() {
  return this.bbox;
};

Entity.getMesh = function() {
  return this.mesh;
};

Entity.intersected = function(ray) {
  return ray.intersectObject(this.bbox).length > 0;
};

