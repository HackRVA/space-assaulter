(function () {
    'use strict';

    const Base = Object.create(null);

    Base.create = function() {
        var created = Object.create(this);
        created.init.apply(created, arguments);
        return created;
    };

    Base.init = function(created) {
    };

    const Vector$2 = Object.create(Base);

    Vector$2.init = function(data) {
      this.data = data;
    };

    Vector$2.x = function() {
      return this.data[0];
    };

    Vector$2.y = function() {
      return this.data[1];
    };

    Vector$2.z = function() {
      return this.data[2];
    };

    Vector$2.flat = function() {
      return [this.x(), this.y(), this.z()];
    };

    Vector$2.scale = function(value) {
      return Vector$2.create([this.x() * value, this.y() * value, this.z() * value]);
    };

    Vector$2.add = function(that) {
      return Vector$2.create([this.x() + that.x(), this.y() + that.y(), this.z() + that.z()]);
    };

    Vector$2.flip = function() {
      return Vector$2.create([-this.x(), -this.y(), -this.z()]);
    };

    Vector$2.dot = function(that) {
      return this.x() * that.x() + this.y() * that.y() + this.z() * that.z();
    };

    Vector$2.cross = function(that) {
      return Vector$2.create([
        this.y() * that.z() - this.z() * that.y(),
       -this.x() * that.z() + this.z() * that.x(),
        this.x() * that.y() - this.y() * that.x()]);
    };

    Vector$2.lengthSq = function() {
      return this.x() * this.x() + this.y() * this.y() + this.z() * this.z();
    };

    Vector$2.length = function() {
      return Math.sqrt(this.lengthSq());
    };

    Vector$2.normalize = function() {
      var length = this.length();
      return Vector$2.create([
        this.x() / length,
        this.y() / length,
        this.z() / length]);
    };

    const SimUnit = Object.create(Base);

    // More advanced simulation may make sense in the future
    // but for now, create a set point that is approached linearly

    SimUnit.init = function(t0, pos, speed, hitbox) {
      this.hit = hitbox;
      this.t0 = t0;
      this.pos = pos;
      this.speed = speed;
      this.goal = pos;
    };

    SimUnit.fromTransport = function(u) {
      SimUnit.create(
        u.t, 
        Vector$2.create(u.pos), 
        u.speed, 
        BoundingShape.fromTransport(u.bbox));
    };

    SimUnit.setGoal = function(point, t) {
      this.t0 = t;
      this.pos = this.getPosition();
      this.goal = point;
    };

    SimUnit.getPosition = function(t) {
      // Vector from starting location to goal
      var path = this.goal.add(this.pos.flip());
      var dt = t - t0;
      if (path.length() < dt * this.speed)
        return this.goal;
      else
        return path.normalize().scale(dt * this.speed);
    };

    SimUnit.getVelocity = function(t) {
      // Vector from starting location to goal
      var path = this.goal.add(this.pos.flip());
      var dt = t - t0;
      if (path.length() < dt * this.speed)
        return Vector$2.create([0, 0, 0]);
      else
        return path.normalize().scale(this.speed);
    };

    // Stealing an idea Eli had on Moon Defender
    SimUnit.getHitbox = function(direction) {
      return this.hit;
    };

    SimUnit.collides = function(that) {
      // Vector from this->that
      var diff = that.getPosition().add(this.getPosition().flip());
      // Vector this->edge of this
      // var bound = diff.normalize().scale(this.getHitbox().distance(diff));
      // Vector from that->this
      // var flipdiff = diff.flip();
      // Is the vector from that->edge of this inside of the other object?
      return this.getHitbox.inside(diff.flip().add(
        diff.normalize().scale(
          this.getHitbox().distance(diff))));
    };

    SimUnit.makeUpdate = function(t) {
      var pos = this.getPosition();
      var vel = this.getVelocity();
      return {
        "pos": pos.flat(),
        "vel": vel.flat()
      };
    };

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

}());