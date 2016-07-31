import { NestingScreen } from './nestingscreen.js';
import THREE from 'three';
const Scene = THREE.Scene;
const Raycaster = THREE.Raycaster;
const PerspectiveCamera = THREE.PerspectiveCamera;
const DirectionalLight = THREE.DirectionalLight;
const AmbientLight = THREE.AmbientLight;
const Vector2 = THREE.Vector2;
import { Screen } from 'canvas-screens';
import { GLScreen } from './glscreen.js';

export const MenuScreen = Object.create(NestingScreen);

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

// Options are in the third dimension now
// Use a raycaster to determine whether an option is highlighted

// Use bounding boxes to define spaces to click to navigate to another screen
// Use meshes to display
MenuScreen.init = function(renderer, options, aesthetic_meshes) {
  NestingScreen.init.call(this, renderer);
  this.meshes = (aesthetic_meshes === undefined)? []: aesthetic_meshes;
  this.options = options;

  this.scene.add(new DirectionalLight(0xFFFFFF, 0.5));
  this.scene.add(new AmbientLight(0xFFFFFF, 0.2));
  this.mouse_pos = new Vector2();
  this.mouse_held = false;
  this.addHandler(this.target, "mousemove", (function(e){
    this.mouse_pos = getMousePosition(e, this.target)
  }).bind(this));
  this.addHandler(this.target, "mousedown", (function(e){
    var raycaster = new Raycaster();
    raycaster.setFromCamera(this.mouse_pos, this.getCamera());
    for(var c = 0; c < this.options.length; c++)
      if(this.options[c].intersected())
        this.options[c].select();
    this.mouse_held = true;
  }).bind(this));
  this.addHandler(this.target, "mouseout", (function(e){
    this.mouse_held = false;
  }).bind(this));
  this.addHandler(this.target, "mouseup", (function(e){
    this.mouse_held = false;
  }).bind(this));
}

MenuScreen.open = function(graph) {
  NestingScreen.open.call(this, graph);
  graph.rebaseStack();

  var c;
  for(c = 0; c < this.options.length; c++)
    this.scene.add(this.options[c]);
  for(c = 0; c < this.aesthetic_meshes.length; c++)
    this.scene.add(this.aesthetic_meshes[c]);
}

