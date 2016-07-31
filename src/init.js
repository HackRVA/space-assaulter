
// external
import { ScreenGraph } from 'canvas-screens';
// internal
import { LoadingScreen } from './loadingscreen.js';
import { MenuScreen } from './menuscreen.js';
import { Selectable } from './selectable.js';
import { FutureMesh } from './futuremesh.js';
import THREE from 'three';
const WebGLRenderer = THREE.WebGLRenderer;
const JSONLoader = THREE.JSONLoader;
const Mesh = THREE.Mesh;

export function init() {
  var canvas = document.getElementById("canvas");
  var renderer = new WebGLRenderer({
    "canvas": canvas
  });
  var loadscreen = LoadingScreen.create(renderer, "resources/hackrva.json");
  var loader = loadscreen.getLoader();
  var mesh_loader = new JSONLoader(loader);

  var serpent = FutureMesh.create("resources/serpent.json", mesh_loader);
  var space_station = FutureMesh.create("resources/space-station.json", mesh_loader);
  var tank = FutureMesh.create("resources/tank.json", mesh_loader);

  var options = [
    Selectable.create(serpent),
    Selectable.create(space_station),
    Selectable.create(tank)];

  // Load data
  options[0].addOnSelect(function() {
    console.log("Selected Mesh 0ne");
  });
  options[1].addOnSelect(function() {
    console.log("Selected Mesh Two");
  });
  options[2].addOnSelect(function() {
    console.log("Selected Mesh Three");
  });

  options[0].position.z = -1000;
  options[0].position.x = -20;
  options[1].position.z = -1000;
  options[1].position.x = 0;
  options[2].position.z = -1000;
  options[2].position.x = 20;

  options[0].addOnSelect(function() {
    console.log("first");
  });
  options[1].addOnSelect(function() {
    console.log("second");
  });
  options[2].addOnSelect(function() {
    console.log("third");
  });

  // Load all the desired 
  ScreenGraph.create([
    loadscreen,
    MenuScreen.create(renderer, options, [])
  ], [[1], []]).open();
}

