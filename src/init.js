
// external
import { ScreenGraph } from 'canvas-screens';
// internal
import { LoadingScreen } from './loadingscreen.js';
import THREE from 'three';
const WebGLRenderer = THREE.WebGLRenderer;

export function init() {
  var canvas = document.getElementById("canvas");
  var renderer = new WebGLRenderer({
    "canvas": canvas
  });
  var loadscreen = LoadingScreen.create(renderer, "resources/hackrva.json");
  var loader = loadscreen.getLoader();

  // Load data

  // Load all the desired 
  ScreenGraph.create([
    loadscreen
  ], [[1]]).open();
}

