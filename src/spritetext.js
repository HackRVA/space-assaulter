import Base from 'canvas-screens';
import THREE from 'three';

const Sprite = THREE.Sprite;
const SpriteMaterial = THREE.SpriteMaterial;
const Texture = THREE.Texture;

export const SpriteText = Object.create(Sprite.prototype);

SpriteText.create = Base.create;

SpriteText.init = function(text, ctx, bgcolor, border, spacing, stroke) {
  // Allows canvas reuse but won't require it
  this.ctx = ctx;
  this.canvas = ctx.canvas;
  this.bgcolor = (bgcolor === undefined) null : bgcolor;
  this.stroke = (stroke === undefined) false : stroke;
  var canvas = ctx.canvas;
  this.offset = 0;
  var truewidth = 0;
  if(border) {
    spacing = (spacing === undefined) 2 : spacing;
    this.offset = spacing + ctx.lineWidth;
  }
  var measure = ctx.measureText(text);
  this.truewidth = Math.ceil(measure.width + 2 * offset);
  // wonky way to get height
  this.maxheight = 2 * parseInt(ctx.font);
  if("actualBoundingBoxAscent" in measure && 
    "actualBoundingBoxDescent" in measure) {
    // easy way to get height
    this.trueheight = measure.actualBoundingBoxAscent + 
      measure.actualBoundingBoxDescent + 2 * this.offset;
    this.maxheight = this.trueheight;
  }
  canvas.width = Math.max(truewidth, canvas.width);
  canvas.height = Math.max(maxheight, canvas.height);
  this.drawBackground();
  this.drawText();
  if(!("trueheight" in this)) {
    // TODO calculate trueheight the hard way
    this.trueheight = this.maxheight;
  }
  this.drawBorder();
  // draw the border
  var texture = new Texture(this.canvas.getImageData(0, 0, this.truewidth, this.trueheight));
  var material = new SpriteMaterial({"map": texture});
  Sprite.call(this, material);
};

SpriteText.drawBackground = function() {
  this.ctx.save();
  this.ctx.globalCompositeOperation = "source-over";
  if(this.bgcolor)
    this.ctx.fillStyle = this.bgcolor;
    this.ctx.fillRect(this.canvas.width, this.canvas.height);
  else
    this.ctx.clearRect(this.canvas.width, this.canvas.height);
  this.ctx.restore();
};

SpriteText.drawText = function() {
  this.ctx.save();
  this.ctx.textBaseline = "top";
  this.ctx.textAlign = "left";
  this.ctx.globalCompositeOperation = "source-over";
  if(this.stroke)
    ctx.strokeText(this.text, this.offset, this.offset);
  else
    ctx.fillText(this.text, this.offset, this.offset);
  this.ctx.restore();
};

SpriteText.drawBorder = function() {
  this.ctx.save();
  var lw = this.ctx.lineWidth;
  this.ctx.globalCompositeOperation = "source-over";
  this.ctx.strokeRect(
    lw / 2,
    lw / 2,
    this.truewidth - lw + 2 * this.offset,
    this.trueheight - lw + 2 * this.offset);
  this.ctx.restore();
};

