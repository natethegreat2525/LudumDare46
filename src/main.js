import { Mouse } from "./mouse";
import { generatePlanet } from "./terrain";
import { Grid } from "./grid";
import { Camera } from "./camera";
import { Key } from "./key";
import { Player } from "./player";

let ctx = null;
let grid = new Grid(1200, 1200);
const screenW = 800;
const screenH = 600;

let player = new Player(800, 800);
//let player = new Player(0, 0);
let cam = new Camera(500, 500, { x: player.x, y: player.y });
let oldTime = 0;
let mouseSubVec = { x: 0, y: 0 };

let entities = [];

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);
    mouseSubVec.x = Mouse.width / 2;
    mouseSubVec.y = Mouse.height / 2;

    grid.tiles = generatePlanet(1200, "test", 550, 4, .5, 50);
    grid.buildChunks();

    entities.push(player);

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

    cam.update(ctx, { x: player.x, y: player.y }, mouseSubVec);

    entities.forEach(e => e.update(dt, grid));
    grid.rebuildDirty();

    ctx.setTransform(1,0,0,1,-Math.floor(cam.position.x),-Math.floor(cam.position.y));
    /*
    grid.renderChunks(ctx, 
                      cam.position,
                      screenW/grid.tileSize, 
                      screenH/grid.tileSize,
                      cam.zoom);
                      */
    grid.update();
    grid.renderChunks(ctx);
    entities.forEach(e => e.render(ctx));

    requestAnimationFrame(render);
}