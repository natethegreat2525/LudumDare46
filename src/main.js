import { Mouse } from "./mouse";
import { generatePlanet } from "./terrain";
import { Grid } from "./grid";
import { Camera } from "./camera";
import { HUD } from "./hud";
import { Key } from "./key";
import { Player } from "./player";
import { EntityManager } from "./entitymanager";
import { FluidManager, FluidParticle } from "./fluidmanager";

let ctx = null;
let grid = new Grid(600, 600);
const screenW = 800;
const screenH = 600;

let entityManager = new EntityManager();
let fluidManager = new FluidManager();

let player = new Player(800, 800);
let cam = new Camera(screenW, screenH, { x: player.x, y: player.y });
let hud = new HUD(screenW, screenH);
let oldTime = 0;
let entities = [];

function processGridForLava(grid) {
    for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
            if (grid.tiles[x + y*grid.width] === 6) {
                //lava
                grid.tiles[x + y*grid.width] = 1;
                if (Math.random() > .9) {
                    fluidManager.particles.push(new FluidParticle(x*grid.tileSize, y*grid.tileSize, 1));
                }
            }
        }
    }
}

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);

    grid.tiles = generatePlanet(600, "test" + Math.random(), 250, 4, .5, 50);
    processGridForLava(grid);
    grid.buildChunks();

    grid.setBlockValue(300, 300-58, 5);
    for (let i = 0; i < 100; i ++) {
        let d = Math.random() * 15;
        grid.setBlockValue(300 + Math.floor(Math.random() * d-d/2), 300-58 +Math.floor(d), 5);
    }

    entityManager.addEntity(player);
    entityManager.cam = cam;
    
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

    cam.update({ x: player.x, y: player.y });

    entityManager.update(grid, dt);
    grid.rebuildDirty();
    fluidManager.update(grid, 1, entityManager);
    
    let diffX = cam.position.x - grid.width*grid.tileSize/2;
    let diffY = cam.position.y - grid.height*grid.tileSize/2;
    cam.angle = Math.atan2(diffY, diffX) + Math.PI/2;
    ctx.transform(1, 0,
                  0, 1,
                  screenW/2, screenH/2);
    ctx.transform(Math.cos(cam.angle), -Math.sin(cam.angle), Math.sin(cam.angle), Math.cos(cam.angle), 0, 0);
    ctx.transform(cam.zoom, 0,
                  0, cam.zoom,
                  0, 0);
    ctx.transform(1, 0,
                  0, 1,
                  -Math.floor(cam.getCorner().x), -Math.floor(cam.getCorner().y));
    grid.update();

    grid.renderChunks(ctx);
    entityManager.render(ctx);
    fluidManager.render(ctx);
    entities.forEach(e => e.render(ctx));

    hud.render(ctx);

    requestAnimationFrame(render);
}