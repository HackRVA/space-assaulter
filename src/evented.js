import { Base } from "canvas-screens";

export const Evented = Object.create(Base);

Evented.init = function() {
  this.links = new Object();
}

Evented.link = function(name, cb) {
  if(name in this.links)
    this.links[name].push(cb);
  else
    this.links[name] = [cb];
}

Evented.trigger = function(name, args) {
  if(name in this.links)
    for(var c = 0; c < this.links[name].length; c++)
      this.links[name][c](args);
}

