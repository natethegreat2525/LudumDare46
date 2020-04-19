import { startGame } from "./main";

function initCanvas(id) {
  let canvas = document.getElementById(id);
  canvas.width = 1280;
  canvas.height = 720;
  let ctx = canvas.getContext('2d');
  return ctx;
}

startGame(initCanvas('gamecanvas'));