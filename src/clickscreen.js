import { NestingScreen } from './nestingscreen.js';
import { Vector2, Raycaster } from 'three';
/*
import THREE from 'three';
const Vector2 = THREE.Vector2;
const Raycaster = THREE.Raycaster;
*/

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

  this.mousePos = new Vector2();
  this.mouseHeld = [false, false, false, false, false];

  this.mouseDownPos= [
    null,
    null,
    null,
    null,
    null];

  this.addHandler(this.target, "contextmenu", (function(e){
    e.preventDefault();
  }).bind(this));

  this.addHandler(this.target, "mousemove", (function(e){
    this.mousePos = getMousePosition(e, this.target);
  }).bind(this));

  this.addHandler(this.target, "mousedown", (function(e){
    e.preventDefault();
    this.mousePos = getMousePosition(e, this.target);

    if(!this.mouseHeld[e.button]) {
      this.mouseDownPos[e.button] = this.mousePos;
      var raycaster = new Raycaster();
      raycaster.setFromCamera(this.mousePos, this.getCamera());
      var options = this.scene.children;
      this.scene.traverse((function(e, raycaster, child) {
        if("cast" in child)
          child.cast(e, raycaster);
      }).bind(this, e, raycaster));
    }

    this.mouseHeld[e.button] = true;
  }).bind(this));

  this.addHandler(this.target, "mouseout", (function(e){
    this.mouseDownPos = [
      null, null, null, null, null];
    this.mouseHeld = [false, false, false, false, false];
  }).bind(this));

  this.addHandler(this.target, "mouseup", (function(e){
    this.mouseHeld[e.button] = false;
    this.mouseDownPos[e.button] = null;
  }).bind(this));

};

ClickScreen.addOption = function(option) {
  this.scene.add(option);
};

ClickScreen.removeOption = function(idx) {
  this.scene.remove(option);
};

