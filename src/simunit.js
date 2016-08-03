import { Base } from 'canvas-screens';
import { Vector } from './vector.js';

export const SimUnit = Object.create(Base);

// More advanced simulation may make sense in the future
// but for now, create a set point that is approached linearly

SimUnit.init = function(t0, pos, speed, hitbox) {
  this.hit = hitbox;
  this.t0 = t0;
  this.pos = pos;
  this.speed = speed;
  this.goal = pos;
};

SimUnit.fromTransport = function(u) {
  SimUnit.create(
    u.t, 
    Vector.create(u.pos), 
    u.speed, 
    BoundingShape.fromTransport(u.bbox));
};

SimUnit.setGoal = function(point, t) {
  this.t0 = t;
  this.pos = this.getPosition();
  this.goal = point;
};

SimUnit.getPosition = function(t) {
  // Vector from starting location to goal
  var path = this.goal.add(this.pos.flip());
  var dt = t - t0;
  if (path.length() < dt * this.speed)
    return this.goal;
  else
    return path.normalize().scale(dt * this.speed);
};

SimUnit.getVelocity = function(t) {
  // Vector from starting location to goal
  var path = this.goal.add(this.pos.flip());
  var dt = t - t0;
  if (path.length() < dt * this.speed)
    return Vector.create([0, 0, 0]);
  else
    return path.normalize().scale(this.speed);
};

// Stealing an idea Eli had on Moon Defender
SimUnit.getHitbox = function(direction) {
  return this.hit;
};

SimUnit.collides = function(that) {
  // Vector from this->that
  var diff = that.getPosition().add(this.getPosition().flip());
  // Vector this->edge of this
  // var bound = diff.normalize().scale(this.getHitbox().distance(diff));
  // Vector from that->this
  // var flipdiff = diff.flip();
  // Is the vector from that->edge of this inside of the other object?
  return this.getHitbox.inside(diff.flip().add(
    diff.normalize().scale(
      this.getHitbox().distance(diff))));
};

SimUnit.makeUpdate = function(t) {
  var pos = this.getPosition();
  var vel = this.getVelocity();
  return {
    "pos": pos.flat(),
    "vel": vel.flat()
  };
};

