import { Mouse } from "./mouse";
import { HUD } from "./hud";
import { GameState } from "./gamestate";

let ctx = null;
const screenW = 1280;
const screenH = 720;

let gs = new GameState(screenW, screenH);
let hud = new HUD(screenW, screenH);
let oldTime = 0;

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);

    gs.start()

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
    gs.cam.update({ x: gs.player.x, y: gs.player.y });

    let diffX = gs.cam.position.x - gs.grid.width*gs.grid.tileSize/2;
    let diffY = gs.cam.position.y - gs.grid.height*gs.grid.tileSize/2;
    gs.cam.angle = Math.atan2(diffY, diffX) + Math.PI/2;
    ctx.transform(1, 0,
                  0, 1,
                  screenW/2, screenH/2);
    ctx.transform(Math.cos(gs.cam.angle), -Math.sin(gs.cam.angle), Math.sin(gs.cam.angle), Math.cos(gs.cam.angle), 0, 0);
    ctx.transform(gs.cam.zoom, 0,
                  0, gs.cam.zoom,
                  0, 0);
    ctx.transform(1, 0,
                  0, 1,
                  -Math.floor(gs.cam.getCorner().x), -Math.floor(gs.cam.getCorner().y));

    gs.update(dt);
    gs.grid.renderChunks(ctx);
    gs.entityManager.render(ctx);
    gs.entities.forEach(e => e.render(ctx));
    gs.fluidManager.render(ctx);
    hud.render(ctx, gs.player);

    requestAnimationFrame(render);
}