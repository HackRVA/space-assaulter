import { Base } from 'canvas-screens';
import { Sprite, SpriteMaterial, UVMapping } from 'three';

/*
import THREE from 'three';
const Sprite = THREE.Sprite;
const SpriteMaterial = THREE.SpriteMaterial;
const UVMapping = THREE.UVMapping;
*/

export const UnitInfo = Object.create(Sprite.prototype);

UnitInfo.create = Base.create;

UnitInfo.init = function(unit) {
  Sprite.call(this);
  this.unit = unit;
  this.position.z = 20;
};

