
// external
import { ScreenGraph } from 'canvas-screens';
// internal
import { LoadingScreen } from './loadingscreen.js';
import { MenuScreen } from './menuscreen.js';
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

  var mesh_urls = [
    "resources/serpent.json",
    "resources/space-station.json",
    "resources/tank.json"];

  var meshes = new Array(mesh_urls.length);
  var mesh_loader = new JSONLoader(loader);
  for(var c = 0; c < mesh_urls.length; c++) {
    var mesh_url = mesh_urls[c];
    mesh_loader.load(mesh_url, (function(i, geometry, materials){
      meshes[i] = new Mesh(geometry, materials[0]);
    }).bind(null, c));
  }

  var material_urls = [
    ""
  ];

  // Load data

  // Load all the desired 
  ScreenGraph.create([
    loadscreen,
    MenuScreen.create(renderer, meshes)
  ], [[1], []]).open();
}

