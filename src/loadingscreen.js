import { NestingScreen } from './nestingscreen.js';
// import { LoadingManager } from 'three';
import THREE from 'three';
const LoadingManager = THREE.LoadingManager;
const Mesh = THREE.Mesh;
const SpotLight = THREE.SpotLight;
const MeshLambertMaterial = THREE.MeshLambertMaterial;
const MeshBasicMaterial = THREE.MeshBasicMaterial;
const JSONLoader = THREE.JSONLoader;

// Fades in a light above the hack.rva logo

export const LoadingScreen = Object.create(NestingScreen);

LoadingScreen.init = function(renderer, load_geom_path) {
  NestingScreen.init.call(this, renderer);

  this.completion = 0;
  this.loader = new LoadingManager((function() {
    // onLoad
  }).bind(this),
  (function(item, loaded, total) {
      console.log(item);
      console.log("loaded: " + loaded);
      console.log("total: " + total);
      if(total)
        this.completion = loaded / total;
      else
        this.completion = 1;
      console.log(this.completion);
  }).bind(this));

  this.hack_rva_mesh = null;
  this.mesh = null;
  var hack_rva_loader = new JSONLoader(this.loader);
  var material = new MeshLambertMaterial({
    "color": 0xFFFFFF
  });
//  var material = new MeshBasicMaterial({
//    "color": 0xFFFFFF
//  });

  var light = new SpotLight(0xFFFFFF, 1.0, 1000);
  light.position.y = 200;
  this.getScene().add(light);
  this.mesh = null;

  hack_rva_loader.load(load_geom_path, (
    function(geometry, materials) {
      this.mesh = new Mesh(geometry, material);
      this.mesh.rotation.x = Math.PI / 2;
      this.getScene().add(this.mesh);
    }).bind(this));
  this.getCamera().position.z = 500;
};

LoadingScreen.getLoader = function() {
  return this.loader;
}

LoadingScreen.draw = function(currentTime) {
  if(this.mesh) {
    this.mesh.rotation.x = this.completion * Math.PI / 2;
  }
  NestingScreen.draw.call(this, currentTime);
};

