import { ClickScreen } from './clickscreen.js';

export const MapScreen = Object.create(ClickScreen);

// Need to be able to select units

MapScreen.init = function(renderer, units) {
  ClickScreen.init.call(this, renderer, units);
  this.worker = null;
  this.ctrlAltActions = {};
  this.ctrlActions = {};
  this.altActions = {};
  this.keyActions = {};

  this.addHandler(this.target, "keydown", (function(e) {
    e.preventDefault();
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
      this.keyActions[e.key](e);
  }).bind(this));

  this.addHandler(this.target, "keyup", (function(e) {
    var cx = e.key;
  }).bind(this));

};

MapScreen.open = function() {
  ClickScreen.open.call(this);
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
};

