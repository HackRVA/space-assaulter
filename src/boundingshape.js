import { Base } from 'canvas-screens';
import { LinearVector } from './vector.js';

// Stealing an idea from Eli Woods on how to create bounding shapes
export const BoundingShape = Object.create(Base);

BoundingShape.distance = function(direction) {
  return 0;
};

BoundingShape.inside = function(point) {
  return point.lengthSq() === 0;
};

export const BoundingCircle = Object.create(BoundingShape);

BoundingCircle.init = function(r) {
  BoundingShape.init.call(this);
  this.r = r;
};

BoundingCircle.distance = function(direction) {
  return direction.normalize().scale(this.r);
};

BoundingCircle.inside = function(point) {
 return point.lengthSq() < this.r * this.r;
};

export const BoundingBox = Object.create(BoundingShape);

BoundingBox.init = function(length, width, height) {
  this.dims = [length, width, height];
};

BoundingBox.distance = function(direction) {
  // Normalize
  var dirs = [
    direction.x(),
    direction.y(),
    direction.z()];
  var norms = direction.flat().map(function(cv, idx) { return cv / this.dims[idx]; }, this);
  var maxidx = 0;
  for(var c = 1; c < norms.length; c++)
    if(norms[c] > norms[maxidx])
      maxidx = c;
  return this.dims[maxidx] / direction.normalize().flat()[maxidx];
};

BoundingBox.inside = function(point) {
  return point.x() >= -this.dims[0] && point.x() <= this.dims[0] && 
    point.y() >= -this.dims[1] && point.y() <= this.dims[1] &&
    point.z() >= -this.dims[2] && point.z() <= this.dims[2];
};

