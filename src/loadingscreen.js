import { NestingScreen } from './nestingscreen.js';
// import { LoadingManager } from 'three';
import THREE from 'three';
const LoadingManager = THREE.LoadingManager;
const Mesh = THREE.Mesh;
const SpotLight = THREE.SpotLight;
const MeshLambertMaterial = THREE.MeshLambertMaterial;
const JSONLoader = THREE.JSONLoader;

// Fades in a light above the hack.rva logo

export const LoadingScreen = Object.create(NestingScreen);

LoadingScreen.init = function(renderer, load_geom) {
  NestingScreen.init.call(this, renderer);

  this.completion = 0;
  this.done = false;
  this.loader = new LoadingManager((function() {
    this.done = true;
  }).bind(this),

  (function(item, loaded, total) {
      if(total)
        this.completion = loaded / total;
      else
        this.completion = 1;
  }).bind(this));

  this.hack_rva_mesh = null;
  this.mesh = null;

  var light = new SpotLight(0xFFFFFF, 1.0, 700);
  light.position.y = 200;
  this.getScene().add(light);
  load_geom.rotation.x = Math.PI / 2;
  this.mesh = load_geom;
  this.getScene().add(this.mesh);

  this.getCamera().position.z = 100;
};

LoadingScreen.open = function(graph) {
  graph.rebaseStack();
  NestingScreen.open.call(this, graph);
};

LoadingScreen.getLoader = function() {
  return this.loader;
};

LoadingScreen.draw = function(currentTime) {
  if(this.dt > 0.1)
    console.log(this.dt);
  if(this.elapsedTime < 2)
    this.mesh.rotation.x = (this.elapsedTime / 2) * Math.PI / 2;
  else
    this.mesh.rotation.x = Math.PI / 2;
  NestingScreen.draw.call(this, currentTime);
  if(this.done && this.elapsedTime > 2.5) {
    this.descend(0);
  }
};

