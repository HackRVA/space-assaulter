import { Base } from 'canvas-screens';
import THREE from 'three';

const Sprite = THREE.Sprite;
const SpriteMaterial = THREE.SpriteMaterial;
const Vector3 = THREE.Vector3;
const Matrix4 = THREE.Matrix4;
const Texture = THREE.Texture;
const DataTexture = THREE.DataTexture;
const UnsignedByteType = THREE.UnsignedByteType;
const RGBAFormat = THREE.RGBAFormat;
const UVMapping = THREE.UVMapping;
const ClampToEdgeWrapping = THREE.ClampToEdgeWrapping;

export const SpriteText = Object.create(Sprite.prototype);

SpriteText.create = Base.create;

SpriteText.init = function(text, fgcolor, bgcolor, font, border, spacing, stroke) {
  // Allows canvas reuse but won't require it
  this.text = text;
  this.fgcolor = fgcolor;
  this.font = font;
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.ctx.font = this.font;
  this.bgcolor = (bgcolor === undefined)? null : bgcolor;
  this.stroke = (stroke === undefined)? false : stroke;
  this.offset = 0;
  var truewidth = 0;
  if(border) {
    spacing = (spacing === undefined)? 2 : spacing;
    this.offset = spacing + this.ctx.lineWidth;
  }
  var measure = this.ctx.measureText(text);
  this.truewidth = Math.ceil(measure.width + 2 * this.offset);
  // wonky way to get height
  this.trueheight = parseInt(this.font);
  if("actualBoundingBoxAscent" in measure && 
    "actualBoundingBoxDescent" in measure) {
    // easy, accurate way to get height
    this.trueheight = measure.actualBoundingBoxAscent + 
      measure.actualBoundingBoxDescent + 2 * this.offset;
  }
  // resize clears canvas state
  var resolution_scaling = 1;
  var upwidth = Math.pow(2, resolution_scaling + Math.ceil(Math.log2(this.truewidth)));
  var upheight = Math.pow(2, resolution_scaling + Math.ceil(Math.log2(this.trueheight)));
  this.canvas.width = upwidth;
  this.canvas.height = upheight;
  // Need to flip in canvas space first
  this.ctx.transform(1, 0, 0, -1, 0, upheight);
  this.ctx.fillStyle = this.fgcolor;
  this.ctx.strokeStyle = this.fgcolor;
  this.ctx.font = this.font;
  // Perform scaling to capture
  this.ctx.scale(upwidth / this.truewidth, upheight / this.trueheight);
  this.drawBackground();
  this.drawText();
  this.drawBorder();
  // draw the border
  var data = this.ctx.getImageData(0, 0, upwidth, upheight);
  var texture = new DataTexture(
    new Uint8Array(data.data), 
    data.width, 
    data.height, 
    RGBAFormat, 
    UnsignedByteType, 
    UVMapping, 
    ClampToEdgeWrapping, 
    ClampToEdgeWrapping);
  texture.needsUpdate = true;
  var material = new SpriteMaterial({"color": 0xffffff, "map": texture});
  Sprite.call(this, material);
  var scaleMatrix = new Matrix4();
  scaleMatrix.scale(new Vector3(this.truewidth / 100, this.trueheight / 100, 1));
  this.applyMatrix(scaleMatrix);
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
  this.ctx.globalCompositeOperation = "source-over";
  var lw = this.ctx.lineWidth;
  this.ctx.strokeRect(
    lw / 2,
    lw / 2,
    this.truewidth - lw,
    this.trueheight - lw);
  this.ctx.restore();
};

