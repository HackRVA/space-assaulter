import { SimUnit } from './simunit.js';

// Chews on a processor by doing update calculations

onmessage = function(msg) {
  var ret = {};
  var c;
  // Process newly created units
  if("units" in msg) {
    var units = msg.units;
    for(c = 0; c < units.length; c++) {
      // units[c]
      SimUnit.create(
        units[c].t,
        Vector.create(units[c].pos),
        units[c].speed);
    }
  }
  // Process commands supplied to units
  if("commands" in msg) {
    var commands = msg.commands;
    for(c = 0; c < commands.length; c++) {
    }
  }
  // read commands
  // operate the simulation as quickly as possible
  // Send back information about the moving objects
  postMessage();
};

