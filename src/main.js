import { Mouse } from "./mouse";
import { HUD } from "./hud";
import { GameState } from "./gamestate";
import { UI } from "./ui";
import { LevelTransition } from "./leveltransition";
import { level_configs } from "./levels";

let ctx = null;
const screenW = 1280;
const screenH = 720;

let gs = new GameState(screenW, screenH);
let hud = new HUD(screenW, screenH);
let ui = new UI(screenW, screenH);
let stars = new Image(screenW, screenH);
let oldTime = 0;

export function startGame(context) {
    
    let canv = document.createElement('canvas');
    canv.width = screenW;
    canv.height = screenW;
    let cctx = canv.getContext('2d');
    cctx.fillStyle = '#ffffff';
    for (let i = 0; i < 500; i++) {
        let x = Math.random() * screenW;
        let y = Math.random() * screenW;
        let w = Math.floor(Math.random() * 1) + 1;
        cctx.fillRect(x,y,w,w);
    }
    stars.src = canv.toDataURL('image/png');

    ctx = context;
    Mouse.init(ctx.canvas);
    ui.setupMainMenu(ctx)
    gs.start(true)
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

    //if (!gs.inMainMenu) {
        if (gs.entityManager) {
            if (!gs.inMainMenu) {
                gs.cam.update({ x: gs.player.x, y: gs.player.y });
            } else {
                let c = gs.grid.width*gs.grid.tileSize/2;
                let a = new Date().getTime()/16000.0;

                gs.cam.update({ x: c+Math.sin(a)*200*4, y: c+Math.cos(a)*200*4});
            }

            ctx.transform(1, 0,
                0, 1,
                screenW/2, screenH/2);
            ctx.transform(Math.cos(gs.cam.angle), -Math.sin(gs.cam.angle), Math.sin(gs.cam.angle), Math.cos(gs.cam.angle), 0, 0);
            ctx.drawImage(stars, -screenW/2, -screenW/2);
            ctx.resetTransform();


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

            let cx = gs.grid.width*gs.grid.tileSize/2;
            let levelRad = (gs.entityManager.levelConfig.outerRadius-30)*gs.grid.tileSize;
            let grad = ctx.createRadialGradient(cx,cx,levelRad,cx,cx,levelRad+180);
            grad.addColorStop(0, '#87CEEB');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,cx*2, cx*2);
            gs.grid.renderChunks(ctx);
            gs.entityManager.render(ctx);
            gs.fluidManager.render(ctx);
            if (!gs.inMainMenu) {
                hud.render(ctx, gs.player, gs);
            }
        }
    ctx.resetTransform();
    //} else {
    if (gs.inMainMenu) {
        let mainMenu = true;
        if (!gs.levelTransition) {
            mainMenu = ui.update(ctx);
        }
        ui.render(ctx);
        if (!mainMenu) {
            gs.levelTransition = new LevelTransition(level_configs[gs.levelCount].message, () => {
                gs.inMainMenu = false;
                gs.start(false);
            });
        }
    }
    gs.renderLevelTransition(ctx);

    requestAnimationFrame(render);
}