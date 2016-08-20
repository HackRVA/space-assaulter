
// external
import { ScreenGraph } from 'canvas-screens';
// internal
import { LoadingScreen } from './loadingscreen.js';
import { MenuScreen } from './menuscreen.js';
import { MapScreen } from './mapscreen.js';
import { Selectable } from './selectable.js';
import { FutureMesh } from './futuremesh.js';
import { Unit } from './unit.js';
import THREE from 'three';
const WebGLRenderer = THREE.WebGLRenderer;
const JSONLoader = THREE.JSONLoader;
const TextureLoader = THREE.TextureLoader;
const Mesh = THREE.Mesh;

export function init() {
  var canvas = document.getElementById("canvas");
  var renderer = new WebGLRenderer({
    "canvas": canvas
  });
  
  var load_geom = FutureMesh.create("resources/hackrva.json", new JSONLoader());
  
  var loadscreen = LoadingScreen.create(renderer, load_geom);
  var mesh_loader = new JSONLoader(loadscreen.getLoader());

  var serpent = FutureMesh.create("resources/serpent.json", mesh_loader);
  var space_station = FutureMesh.create("resources/space-station.json", mesh_loader);
  var tank = FutureMesh.create("resources/tank.json", mesh_loader);

  var options = [
    Selectable.create(serpent.clone()),
    Selectable.create(space_station.clone()),
    Selectable.create(tank.clone())];

  options[0].position.z = -1000;
  options[0].position.x = -20;
  options[1].position.z = -1000;
  options[1].position.x = 0;
  options[2].position.z = -1000;
  options[2].position.x = 20;

  var playscreen = MapScreen.create(renderer, [])

  var serpent_unit = Unit.create(serpent.clone());
  serpent_unit.position.x = -20;
  serpent_unit.rotation.x = Math.PI / 2;

  var space_station_unit = Unit.create(space_station.clone());
  space_station_unit.rotation.x = Math.PI / 2;

  var tank_unit = Unit.create(tank.clone());
  tank_unit.rotation.x = Math.PI / 2;
  tank_unit.position.x = 20;

  playscreen.addUnit(serpent_unit);
  playscreen.addUnit(space_station_unit);
  playscreen.addUnit(tank_unit);

  // Load all the desired 
  var graph = ScreenGraph.create([
    loadscreen,
    MenuScreen.create(renderer, options, []),
    playscreen
  ], [[1], [2, 0, 0], [1]]);

  // Load data
  options[0].addOnSelect((function() {
    this.descend(0);
  }).bind(graph));
  options[1].addOnSelect((function() {
    this.descend(1);
  }).bind(graph));
  options[2].addOnSelect((function() {
    this.descend(2);
  }).bind(graph));

  // Start everything up
  load_geom.callback = graph.open.bind(graph);
}

