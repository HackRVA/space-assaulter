import { ClickScreen } from './clickscreen.js';
import { Base } from 'canvas-screens';
import THREE from 'three';

const LineSegments = THREE.LineSegments;
const Geometry = THREE.Geometry;
const Vector3 = THREE.Vector3;
const LineBasicMaterial = THREE.LineBasicMaterial;
const Object3D = THREE.Object3D;

export const Grid = Object.create(LineSegments.prototype);

Grid.create = Base.create;

Grid.init = function(spacing, w, h) {
  var geom = new Geometry();
  var i;
  for(i = 0; i < w + 1; i++) {
    geom.vertices.push(
      new Vector3(spacing * i, 0, 0),
      new Vector3(spacing * i, spacing * h, 0));
  }
  for(i = 0; i < h + 1; i++) {
    geom.vertices.push(
      new Vector3(0, spacing * i, 0),
      new Vector3(spacing * w, spacing * i, 0));
  }
  var material = new LineBasicMaterial({ "color": 0xFFFFFF });
  LineSegments.call(this, geom, material);
};

export const MapScreen = Object.create(ClickScreen);

// Need to be able to select units

MapScreen.init = function(renderer, units) {
  ClickScreen.init.call(this, renderer, units);
  this.worker = null;
  this.ctrlAltActions = {};
  this.ctrlActions = {};
  this.altActions = {};
  this.keyDownActions = {};
  this.keyLiftActions = {};

  this.translating = [false, false, false, false, false, false];
  this.rotating = [false, false, false, false, false, false];

  this.addHandler(window, "keydown", (function(e) {
    e.preventDefault();
    console.log("key " + cx + " pressed");
    var cx = e.key;
    // TODO don't hardcode the control scheme
    if(e.altKey && e.ctrlKey && e.key in this.ctrlAltKeyActions)
      // with ctrl and alt key
      this.ctrlAltKeyActions[e.key](e);
    else if(e.ctrlKey && e.key in this.ctrlKeyActions)
      // with ctrl key
      this.ctrlKeyActions[e.key](e);
    else if(e.altKey && e.key in this.altKeyActions)
      // with alt key
      this.altKeyActions[e.key](e);
    else
      // no key modifiers
      this.keyDownActions[e.key](e);
  }).bind(this));

  this.addHandler(window, "keyup", (function(e) {
    this.keyLiftActions[e.key](e);
  }).bind(this));

  // The table is the focus of the view, it's a plane that is used to simplify
  // working in 3D, so that everything feels more familiar to 2D RTS fans
  this.table = new Object3D();
  var grid = Grid.create(1, 10, 10);
  this.scene.add(grid);
  // Attach the camera to a table instead of free flying
  this.scene.remove(this.getCamera());
  this.table.add(this.getCamera());

  this.getCamera().position.z = 500;

  this.scene.add(this.table);

  this.keyDownActions.w = (function() {
    this.translating[1] = true;
  }).bind(this);

  this.keyLiftActions.w = (function() {
    this.translating[1] = false;
  }).bind(this);

  this.keyDownActions.s = (function() {
    this.translating[4] = true;
  }).bind(this);

  this.keyLiftActions.s = (function() {
    this.translating[4] = false;
  }).bind(this);

  this.keyDownActions.a = (function() {
    this.translating[3] = true;
  }).bind(this);

  this.keyLiftActions.a = (function() {
    this.translating[3] = false;
  }).bind(this);

  this.keyDownActions.d = (function() {
    this.translating[0] = true;
  }).bind(this);

  this.keyLiftActions.d = (function() {
    this.translating[0] = false;
  }).bind(this);

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

  // Check ongoing actions
  this.table.translateX(this.dt * (this.translating[0] - this.translating[3]));
  this.table.translateY(this.dt * (this.translating[1] - this.translating[4]));
  this.table.translateZ(this.dt * (this.translating[2] - this.translating[5]));
};

