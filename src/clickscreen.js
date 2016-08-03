import { NestingScreen } from './nestingscreen.js';
import THREE from 'three';
const Vector2 = THREE.Vector2;
const Raycaster = THREE.Raycaster;

function getMousePosition(e, target) {
  var vect = new Vector2();
  var rawx = target.width / 2, rawy = target.height / 2;
  if(
      "offsetX" in e && 
      "offsetY" in e) {
    rawx = e.offsetX;
    rawy = e.offsetY;
  } else if(
      "pageX" in e && 
      "pageY" in e && 
      "offsetLeft" in target && 
      "offsetTop" in target) {
    rawx = e.pageX - target.offsetLeft;
    rawy = e.pageY - target.offsetTop;
  }
  vect.x = (2 * rawx - target.width) / target.width;
  vect.y = - (2 * rawy - target.height) / target.height;
  return vect;
}

export const ClickScreen = Object.create(NestingScreen);

ClickScreen.init = function(renderer, options) {
  NestingScreen.init.call(this, renderer);
  if(options.length > 0)
    this.scene.add.apply(this.scene, options);

  this.mouse_pos = new Vector2();
  this.mouse_held = false;

  this.addHandler(this.target, "mousemove", (function(e){
    this.mouse_pos = getMousePosition(e, this.target);
  }).bind(this));

  this.addHandler(this.target, "mousedown", (function(e){
    var raycaster = new Raycaster();
    raycaster.setFromCamera(this.mouse_pos, this.getCamera());

    var options = this.scene.children;
    for(var c = 0; c < options.length; c++)
      if("select" in options[c] && options[c].intersected(raycaster))
        options[c].select();
    this.mouse_held = true;
  }).bind(this));

  this.addHandler(this.target, "mouseout", (function(e){
    this.mouse_held = false;
  }).bind(this));

  this.addHandler(this.target, "mouseup", (function(e){
    this.mouse_held = false;
  }).bind(this));

};

ClickScreen.addOption = function(option) {
  this.scene.add(option);
};

ClickScreen.removeOption = function(idx) {
  this.scene.remove(option);
};

