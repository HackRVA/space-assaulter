import { Selectable } from './selectable.js';
import { UnitInfo } from './unitinfo.js';
import THREE from 'three';
const Vector3 = THREE.Vector3;

export const Unit = Object.create(Selectable);

Unit.init = function(mesh, bbox, life) {
  Selectable.init.call(this, mesh, bbox);
  this.life = life;
  // this.info = UnitInfo.create(this);
  // this.add(this.info);

  // units/second
  this.speed = 1;

  this.addOnSelect((function() {
    // Change the color to highlight green a bit
    this.mesh.material.color = { "r": 0.6, "g": 1.0, "b": 0.6};
    // this.remove(this.info);
  }).bind(this));
  this.addOnDeselect((function() {
    this.mesh.material.color = { "r": 1.0, "g": 1.0, "b": 1.0};
  }).bind(this));
};

Unit.damage = function(base_damage) {
  this.life -= base_damage;
  if(this.life < 0)
    this.onDeath();
};

Unit.onDeath = function() {
};

Unit.setGoal = function(pos) {
  this.goal = pos;
  this.lookAt(this.goal);
};

Unit.update = function(dt) {
  // Move toward the point
  if(this.goal) {
    var distance = this.getWorldPosition().distanceTo(this.goal);
    if(distance < 0.1)
      return;
    this.lookAt(this.goal);
    this.translateOnAxis(
      new Vector3(0, 0, 1),
      Math.min(this.speed * dt, distance));
  }
};

