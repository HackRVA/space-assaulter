import { ClickScreen } from './clickscreen.js';
import { Base } from 'canvas-screens';
import THREE from 'three';

const LineSegments = THREE.LineSegments;
const Geometry = THREE.Geometry;
const Vector2 = THREE.Vector2;
const Vector3 = THREE.Vector3;
const LineBasicMaterial = THREE.LineBasicMaterial;
const Object3D = THREE.Object3D;
const AmbientLight = THREE.AmbientLight;
const DirectionalLight = THREE.DirectionalLight;
const SpotLight = THREE.SpotLight;

export const Grid = Object.create(LineSegments.prototype);

Grid.create = Base.create;

Grid.init = function(spacing, w, h) {
  var geom = new Geometry();
  var i;
  for(i = 0; i < w + 1; i++)
    geom.vertices.push(
      new Vector3(spacing * i, 0, 0),
      new Vector3(spacing * i, spacing * h, 0));
  for(i = 0; i < h + 1; i++)
    geom.vertices.push(
      new Vector3(0, spacing * i, 0),
      new Vector3(spacing * w, spacing * i, 0));
  var material = new LineBasicMaterial({ "color": 0xFFFFFF });
  LineSegments.call(this, geom, material);
};

export const MapScreen = Object.create(ClickScreen);

// Need to be able to select units

MapScreen.init = function(renderer, units) {
  ClickScreen.init.call(this, renderer, units);
  this.worker = null;
  // need key-state system
  this.keyState = {};
  this.keyState.a = false;
  this.keyState.s = false;
  this.keyState.d = false;
  this.keyState.w = false;
  this.keyState.q = false;
  this.keyState.e = false;
  this.keyState.Control = false;
  this.keyState.Shift = false;
  this.keyState.Alt = false;

  this.mouseState = [
    false, 
    false, 
    false, 
    false, 
    false];

  this.keyPressEvent = {};
  this.keyGroups = [];

  this.addHandler(window, "keydown", (function(e) {
    e.preventDefault();
    this.keyState[e.key] = true;
  }).bind(this));

  this.addHandler(window, "keypress", (function(e) {
    e.preventDefault();
    if(e.key in this.keyPressEvent) {
      this.keyPressEvent[e.key](e);
    }
  }).bind(this));

  this.addHandler(window, "keyup", (function(e) {
    e.preventDefault();
    this.keyState[e.key] = false;
  }).bind(this));

  // The table is the focus of the view, it's a plane that is used to simplify
  // working in 3D, so that everything feels more familiar to 2D RTS fans

  this.table = new Object3D();
  // Attach the camera to gimbals instead of free flying
  this.scene.remove(this.getCamera());

  this.z_gimbal = new Object3D();
  this.x_gimbal = new Object3D();
  this.z_gimbal.add(this.x_gimbal);
  this.table.add(this.z_gimbal);
  this.x_gimbal.add(this.getCamera());
  var spacing = 20;
  var width = 10;
  var height = 10;
  var grid = Grid.create(spacing, width, height);
  grid.position.x = -spacing * width / 2;
  grid.position.y = -spacing * height / 2;
  this.table.add(grid);

  this.getCamera().position.z = 500;
  this.getCamera().add(new SpotLight(0xFFFFFF));
  this.scene.add(new AmbientLight(0xFFFFFF, 0.1));
  this.scene.add(new DirectionalLight(0xFFFFFF, 0.2));

  this.scene.add(this.table);

  this.addHandler(window, "wheel", (function(e) {
    e.preventDefault();
    if(e.ctrlKey) {
      // Move the table up and down
      this.table.translateZ(e.deltaY * 0.5);
    } else {
      this.getCamera().translateZ(e.deltaY * 5);
    }
  }).bind(this));
};

MapScreen.open = function(graph) {
  ClickScreen.open.call(this, graph);
  this.worker = new Worker("build/simworker.js");
};

MapScreen.close = function() {
  ClickScreen.close.call(this);
  this.worker.terminate();
};

MapScreen.addUnit = function(unit) {
  this.scene.add(unit);
};

MapScreen.cleanUnits = function() {
  // Remove dead units
  
};

MapScreen.draw = function(currentTime) {
  ClickScreen.draw.call(this, currentTime);
  // Send information to the web worker
  // Pull information from the web worker
  if(this.mouseHeld[0]) {
    var diff = (new Vector2()).subVectors(this.mousePos, this.mouseDownPos[0]);
    // this.table.rotateX(diff.x * this.dt);
    // this.table.rotateY(diff.y * this.dt);
    this.z_gimbal.rotateZ(diff.x * this.dt);
    this.x_gimbal.rotateX(diff.y * this.dt);
  }

  // Use

  // Check ongoing actions
  if(this.keyState.Alt) {
    // this.table.rotateX(this.dt * (this.keyState.d - this.keyState.a));
    // this.table.rotateY(this.dt * (this.keyState.w - this.keyState.s));
    // this.table.rotateZ(this.dt * (this.keyState.q - this.keyState.e));
  } else {
    this.z_gimbal.rotateZ(this.dt * (this.keyState.d - this.keyState.a));
    this.x_gimbal.rotateX(this.dt * (this.keyState.w - this.keyState.s));
    this.getCamera().translateZ(this.dt * 10 * (this.keyState.q - this.keyState.e));
  }
};

