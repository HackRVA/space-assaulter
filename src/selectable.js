import { Entity } from './entity.js';

export const Selectable = Object.create(Entity);
Selectable.init = function(mesh, bbox) {
  Entity.init.call(this, mesh, bbox);
  this.select_cbs = [];
  this.deselect_cbs = [];
  this.selected = false;
};

Selectable.addOnSelect = function(cb) {
  for(var c = 0; c < this.select_cbs.length; c++)
    if(!this.select_cbs[c]) {
      this.select_cbs[c] = cb;
      return c;
    }
  this.select_cbs.push(cb);
  return c;
};

Selectable.removeOnSelect = function(cb_idx) {
  this.select_cbs[cb_idx] = null;
};

Selectable.addOnDeselect = function(cb) {
  for(var c = 0; c < this.select_cbs.length; c++)
    if(!this.deselect_cbs[c]) {
      this.deselect_cbs[c] = cb;
      return c;
    }
  this.deselect_cbs.push(cb);
  return c;
};

Selectable.removeOnDeselect = function(cb_idx) {
  this.deselect_cbs[cb_idx] = null;
};

Selectable.select = function() {
  if(!this.selected) {
    this.selected = true;
    for(var c = 0; c < this.select_cbs.length; c++)
      if(this.select_cbs[c])
        this.select_cbs[c]();
  }
};

Selectable.deselect = function() {
  if(this.selected) {
    this.selected = false;
    for(var c = 0; c < this.deselect_cbs.length; c++)
      if(this.deselect_cbs[c])
        this.deselect_cbs[c]();
  }
};

Selectable.cast = function(e, ray) {
  if(e.button === 0)
    if(ray.intersectObject(this.bbox).length > 0)
      this.select();
    else
      this.deselect();
};

Selectable.isSelected = function() {
  return this.selected;
};

