import { Selectable } from './selectable.js';
import { UnitInfo } from './unitinfo.js';

export const Unit = Object.create(Selectable);

Unit.init = function(mesh, bbox, life, on_death) {
  Selectable.init.call(this, mesh, bbox);
  this.life = life;
  this.info = UnitInfo.create(this);
  this.add(this.info);

  this.addOnSelect((function() {
    // Add a sprite with unit information

    // this.remove(this.info);
  }).bind(this));
};

