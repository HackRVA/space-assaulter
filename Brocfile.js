var Rollup = require('broccoli-rollup');
var NodeResolve = require('rollup-plugin-node-resolve');
var CommonJs = require('rollup-plugin-commonjs');
var Merge = require('broccoli-merge-trees');

var src = "src";

// Create a different resolver

var web = Rollup(src, {
  "inputFiles": ["*.js"],
  "rollup": {
    "entry": "entry.js",
    "format": "iife",
    "dest": "3drts.js",
    "plugins": [
      NodeResolve({
        "jsnext": true,
        "main": true,
        "skip": []
      }),
      CommonJs({
        "include": "node_modules/three/**"
      })
    ]
  }
});

var webworker = Rollup(src, {
  "inputFiles": ["*.js"],
  "rollup": {
    "entry": "simworker.js",
    "format": "iife",
    "dest": "simworker.js",
    "plugins": [
      NodeResolve({
        "jsnext": true,
        "main": true,
        "skip": []
      })
    ]
  }
});

module.exports = Merge([web, webworker]);

