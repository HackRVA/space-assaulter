import { GLScreen } from './glscreen.js';

export const NestingScreen = Object.create(GLScreen);

NestingScreen.init = function(renderer, tree) {
  GLScreen.init.call(this, renderer);
  this.above = null;
};

NestingScreen.open = function(graph) {
  GLScreen.open.call(this);
  this.graph = graph;
};

NestingScreen.descend = function(idx) {
  this.graph.descend(idx);
};

NestingScreen.ascend = function() {
  this.graph.ascend();
};

