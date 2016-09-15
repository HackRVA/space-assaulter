import THREE from 'three';
const Sprite = THREE.Sprite;
const Texture = THREE.Texture;
const SpriteMaterial = THREE.SpriteMaterial;
import { Base } from 'canvas-screens';

export const FutureSprite = Object.create(Sprite.prototype);

FutureSprite.create = Base.create;

FutureSprite.init = function(url, loader, material_params) {
  Sprite.call(this);
  this.loader = loader;
  this.done = false;
  this.mat_params = (material_params === undefined)? {} : material_params;
  this.url = url;
  this.loader.load(url, (function(texture) {
    this.mat_params["map"] = texture;
    this.material = new SpriteMaterial(this.mat_params);
    this.done = true;
  }).bind(this));
}

FutureSprite.clone = function(recursive) {
  return (this.done)?
    Sprite.prototype.call(this, recursive) :
    FutureSprite.create(this.url, this.loader, this.mat_params);
}

