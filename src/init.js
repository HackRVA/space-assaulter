import { IntroScreen } from './introscreen.js';

export function init() {
  var canvas = document.getElementById("canvas");
  var start_screen = IntroScreen.create(canvas, canvas.getContext("webgl"));
  start_screen.open();
}

