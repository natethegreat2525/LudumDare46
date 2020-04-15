import { startGame } from "./main";

function initCanvas(id) {
  let canvas = document.getElementById(id);
  canvas.width = 800;
  canvas.height = 600;
  let ctx = canvas.getContext('2d');
  return ctx;
}

startGame(initCanvas('gamecanvas'));