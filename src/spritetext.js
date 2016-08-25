import { Base } from 'canvas-screens';
import THREE from 'three';

const Sprite = THREE.Sprite;
const SpriteMaterial = THREE.SpriteMaterial;
const Vector3 = THREE.Vector3;
const Texture = THREE.Texture;
const DataTexture = THREE.DataTexture;
const UnsignedByteType = THREE.UnsignedByteType;
const RGBAFormat = THREE.RGBAFormat;
const UVMapping = THREE.UVMapping;
const ClampToEdgeWrapping = THREE.ClampToEdgeWrapping;

export const SpriteText = Object.create(Sprite.prototype);

SpriteText.create = Base.create;

SpriteText.init = function(text, ctx, bgcolor, border, spacing, stroke) {
  // Allows canvas reuse but won't require it
  this.text = text;
  this.ctx = ctx;
  this.canvas = ctx.canvas;
  this.bgcolor = (bgcolor === undefined)? null : bgcolor;
  this.stroke = (stroke === undefined)? false : stroke;
  var canvas = ctx.canvas;
  this.offset = 0;
  var truewidth = 0;
  if(border) {
    spacing = (spacing === undefined)? 2 : spacing;
    this.offset = spacing + ctx.lineWidth;
  }
  var measure = ctx.measureText(text);
  this.truewidth = Math.ceil(measure.width + 2 * this.offset);
  // wonky way to get height
  this.maxheight = 2 * parseInt(ctx.font);
  if("actualBoundingBoxAscent" in measure && 
    "actualBoundingBoxDescent" in measure) {
    // easy way to get height
    this.trueheight = measure.actualBoundingBoxAscent + 
      measure.actualBoundingBoxDescent + 2 * this.offset;
    this.maxheight = this.trueheight;
  }
  canvas.width = Math.max(this.truewidth, canvas.width);
  canvas.height = Math.max(this.maxheight, canvas.height);
  // Perform scaling to capture
  var upwidth = Math.pow(2, Math.ceil(Math.log2(this.truewidth)));
  var upheight = Math.pow(2, Math.ceil(Math.log2(this.maxheight)));
  this.ctx.scale(upwidth / this.truewidth, upheight / this.maxheight);
  this.drawBackground();
  this.drawText();
  if(!("trueheight" in this)) {
    // TODO calculate trueheight the hard way
    this.trueheight = this.maxheight;
  }
  this.drawBorder();
  // draw the border
  // var texture = new Texture(this.ctx.getImageData(0, 0, this.truewidth, this.trueheight));
  // var data = this.ctx.getImageData(0, 0, this.truewidth, this.trueheight);
  var data = this.ctx.getImageData(0, 0, upwidth, upheight);
  // var texture = new Texture(this.ctx.canvas);
  var texture = new DataTexture(
    new Uint8Array(data.data), 
    data.width, 
    data.height, 
    RGBAFormat, 
    UnsignedByteType, 
    UVMapping, 
    ClampToEdgeWrapping, 
    ClampToEdgeWrapping);
  // var texture = new Texture(canvas);
  texture.needsUpdate = true;
  var material = new SpriteMaterial({"color": 0xffffff, "map": texture});
  // Sprite.call(this, material);
  Sprite.call(this, material);
  this.scale.x = data.width / 100;
  this.scale.y = data.height / 100;
};

SpriteText.drawBackground = function() {
  this.ctx.save();
  this.ctx.globalCompositeOperation = "source-over";
  if(this.bgcolor) {
    this.ctx.fillStyle = this.bgcolor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  } else
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.restore();
};

SpriteText.drawText = function() {
  this.ctx.save();
  this.ctx.textBaseline = "top";
  this.ctx.textAlign = "left";
  this.ctx.globalCompositeOperation = "source-over";
  if(this.stroke)
    this.ctx.strokeText(this.text, this.offset, this.offset);
  else
    this.ctx.fillText(this.text, this.offset, this.offset);
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

