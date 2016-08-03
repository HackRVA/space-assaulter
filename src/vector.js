import { Base } from 'canvas-screens';

export const Vector = Object.create(Base);

Vector.init = function(data) {
  this.data = data;
};

Vector.x = function() {
  return this.data[0];
};

Vector.y = function() {
  return this.data[1];
};

Vector.z = function() {
  return this.data[2];
};

Vector.flat = function() {
  return [this.x(), this.y(), this.z()];
};

Vector.scale = function(value) {
  return Vector.create([this.x() * value, this.y() * value, this.z() * value]);
};

Vector.add = function(that) {
  return Vector.create([this.x() + that.x(), this.y() + that.y(), this.z() + that.z()]);
};

Vector.flip = function() {
  return Vector.create([-this.x(), -this.y(), -this.z()]);
};

Vector.dot = function(that) {
  return this.x() * that.x() + this.y() * that.y() + this.z() * that.z();
};

Vector.cross = function(that) {
  return Vector.create([
    this.y() * that.z() - this.z() * that.y(),
   -this.x() * that.z() + this.z() * that.x(),
    this.x() * that.y() - this.y() * that.x()]);
};

Vector.lengthSq = function() {
  return this.x() * this.x() + this.y() * this.y() + this.z() * this.z();
};

Vector.length = function() {
  return Math.sqrt(this.lengthSq());
};

Vector.normalize = function() {
  var length = this.length();
  return Vector.create([
    this.x() / length,
    this.y() / length,
    this.z() / length]);
};

