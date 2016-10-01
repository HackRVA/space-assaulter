
// external
import { ScreenGraph } from 'canvas-screens';
// internal
import { LoadingScreen } from './loadingscreen.js';
import { MenuScreen } from './menuscreen.js';
import { MapScreen } from './mapscreen.js';
import { Selectable } from './selectable.js';
import { FutureMesh } from './futuremesh.js';
import { FutureSprite } from './futuresprite.js';
import { SpriteText } from './spritetext.js';
import { Unit } from './unit.js';
import { connection_test_left, connection_test_right, CGIConnection } from './connection.js';
import THREE from 'three';
const WebGLRenderer = THREE.WebGLRenderer;
const JSONLoader = THREE.JSONLoader;
const TextureLoader = THREE.TextureLoader;
const XHRLoader = THREE.XHRLoader;
const Mesh = THREE.Mesh;
const Vector3 = THREE.Vector3;

export function init() {

  var config = {
    // type of signaling server to use, CGI or WebSocket
    // Currently only CGI is supported
    "signaling-type": "CGI",
    // path to signaling peer list script
    "signaling-list": "",
    // path to signaling peer creation script
    "signaling-create": "",
    // path to signaling message send script
    "signaling-send": "",
    // path to signaling
    "signaling-poll": "",
    // path to signaling peer destruction script
    "signaling-destroy": ""
  };

  var canvas = document.getElementById("canvas");
  var renderer = new WebGLRenderer({
    "canvas": canvas
  });
  
  var load_geom = FutureMesh.create("resources/hackrva.json", new JSONLoader());
  
  var loadscreen = LoadingScreen.create(renderer, load_geom);
  var loader = loadscreen.getLoader();
  var mesh_loader = new JSONLoader(loader);
  var tex_loader = new TextureLoader(loader);
  var xhr_loader = new XHRLoader(loader);

  xhr_loader.load("config.json", function(contents) {
    console.log("Retrieved configuration");
    config = JSON.parse(contents);
    // Run connection tests
    var left_connection = CGIConnection.create(
      config["signaling-list"],
      config["signaling-create"],
      config["signaling-send"],
      config["signaling-poll"],
      config["signaling-destroy"]);
    var right_connection = CGIConnection.create(
      config["signaling-list"],
      config["signaling-create"],
      config["signaling-send"],
      config["signaling-poll"],
      config["signaling-destroy"]);
    connection_test_left(left_connection);
    connection_test_right(right_connection);
    window.addEventListener("close", function() {
      left_connection.destroy();
      right_connection.destroy();
    }, false);
  }, 
  function() {
    console.log("Progress while retrieving configuration");
  },
  function() {
    console.log("Failure while retrieving configuration");
  });

  var serpent = FutureMesh.create("resources/serpent.json", mesh_loader);
  var space_station = FutureMesh.create("resources/space-station.json", mesh_loader);
  var tank = FutureMesh.create("resources/tank.json", mesh_loader, "resources/tank_shuttle.png", tex_loader);

  var start_sprite = SpriteText.create("Start", "#0000FF", null, "20px Helvetica", true);
  var middle_sprite = SpriteText.create("Middle", "#0000FF", null, "20px Helvetica", true);
  var quit_sprite = SpriteText.create("Quit", "#0000FF", null, "20px Helvetica", true);

  var options = [
    Selectable.create(start_sprite.clone()),
    Selectable.create(middle_sprite.clone()),
    Selectable.create(quit_sprite.clone())];

  options[0].position.z = -100;
  options[0].position.x = -2;
  options[1].position.z = -100;
  options[1].position.x = 0;
  options[2].position.z = -100;
  options[2].position.x = 2;

  var playscreen = MapScreen.create(renderer, []);

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
  graph.open();
}

