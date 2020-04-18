//import { Key } from "./key";
import { Mouse } from "./mouse";
import { generatePlanet } from "./terrain";
import { Grid } from "./grid";
import { Key } from "./key";
import { Player } from "./player";

let ctx = null;
let grid = new Grid(1200, 1200);
const screenW = 800;
const screenH = 600;
let camX = 500;
let camY = 500;
let oldTime = 0;

let entities = [];

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);

    grid.tiles = generatePlanet(1200, "test", 550, 4, .5, 50);
    grid.buildChunks();

    entities.push(new Player(800, 800));

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

    camX = entities[0].x - Mouse.width/2;
    camY = entities[0].y - Mouse.height/2;
    entities.forEach(e => e.update(dt, grid));
    grid.rebuildDirty();

    ctx.setTransform(1,0,0,1,-Math.floor(camX),-Math.floor(camY));
    grid.renderChunks(ctx, camX/grid.tileSize, camY/grid.tileSize, screenW/grid.tileSize, screenH/grid.tileSize);
    entities.forEach(e => e.render(ctx));
    requestAnimationFrame(render);
}
