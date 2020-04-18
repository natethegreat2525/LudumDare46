import { Mouse } from "./mouse";
import { generatePlanet } from "./terrain";
import { Grid } from "./grid";
import { Camera } from "./camera";
import { Key } from "./key";
import { Player } from "./player";
import { EntityManager } from "./entitymanager";
import { FluidManager, FluidParticle } from "./fluidmanager";

let ctx = null;
let grid = new Grid(1200, 1200);
const screenW = 800;
const screenH = 600;

let entityManager = new EntityManager();
let fluidManager = new FluidManager();

let player = new Player(800, 800);
let cam = new Camera(screenW, screenH, { x: player.x, y: player.y });
let oldTime = 0;

let entities = [];

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);

    grid.tiles = generatePlanet(1200, "test" + Math.random(), 550, 4, .5, 50);
    grid.buildChunks();

    entityManager.addEntity(player);
    for (let i = 0; i < 2000; i++) {
        fluidManager.particles.push(new FluidParticle(500 + Math.random()*500, 500 + Math.random() * 500));
    }

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

    cam.update({ x: player.x, y: player.y });

    entityManager.update(grid, dt);
    grid.rebuildDirty();
    fluidManager.update(grid, 1);
    
    ctx.transform(1,0,0,1,screenW/2, screenH/2);
    ctx.transform(cam.zoom, 0,
                  0, cam.zoom,
                  0, 0);
    ctx.transform(1,0,
                  0,1,
                  -Math.floor(cam.getCorner().x), -Math.floor(cam.getCorner().y));

    grid.update();
    grid.renderChunks(ctx);
    entityManager.render(ctx);
    fluidManager.render(ctx);

    requestAnimationFrame(render);
}