import { GLScreen } from './glscreen.js';

export const NestingScreen = Object.create(GLScreen);

NestingScreen.init = function(renderer, tree) {
  GLScreen.init(renderer);
  this.above = null;
}

NestingScreen.open = function(graph) {
  GLScreen.open.call(this);
  if(graph.atBase())
    this.above = null;
  else
    this.above = graph.currentParent();
  this.below = graph.currentAdjacent();
  this.graph = graph;
}

NestingScreen.descend = function(idx) {
  this.graph.descend(idx);
}

NestingScreen.ascend = function() {
  this.graph.ascend();
}

