//import { Key } from "./key";
import { Mouse } from "./mouse";
import { generatePlanet } from "./terrain";
import { Grid } from "./grid";
import { Key } from "./key";

let ctx = null;
let grid = new Grid(600, 600);
const screenW = 800;
const screenH = 600;
let camX = 500;
let camY = 500;
let oldTime = 0;
/*
function rand(low, high) {
    return Math.random()*(high-low)+low;
}
*/

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);

    grid.tiles = generatePlanet(600, "test", 250, 4, .5, 50);
    if (ctx) {
        requestAnimationFrame(render);
    }
}

function clear() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function render(delta) {
    let dt = (delta-oldTime)/1000;
    oldTime = delta;

    clear();

    if (Key.isDown(Key.A)) {
        camX -= 100*dt;
    }
    if (Key.isDown(Key.D)) {
        camX += 100*dt;
    }
    if (Key.isDown(Key.W)) {
        camY -= 100*dt;
    }
    if (Key.isDown(Key.S)) {
        camY += 100*dt;
    }

    ctx.setTransform(1,0,0,1,-Math.floor(camX),-Math.floor(camY));
    grid.render(ctx, camX/grid.tileSize, camY/grid.tileSize, screenW/grid.tileSize, screenH/grid.tileSize);
    requestAnimationFrame(render);
}
