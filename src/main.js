//import { Key } from "./key";
import { Mouse } from "./mouse";
import { generatePlanet } from "./terrain";
import { Grid } from "./grid";

let ctx = null;
let grid = new Grid(100, 100);

/*
function rand(low, high) {
    return Math.random()*(high-low)+low;
}
*/

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);

    terrain = generatePlanet(600, "test", 250, 4, .5, 50);

    if (ctx) {
        requestAnimationFrame(render);
    }
}

function clear() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function render() {
    clear();
    for (let x = 0; x < 600; x++) {
        for (let y = 0; y < 600; y++) {
            let v = terrain[x + y*600];
            if (v == 1) {
                ctx.fillStyle = '#765432';
                ctx.fillRect(x,y,1,1);
            }
            if (v == 2) {
                ctx.fillStyle = '#888888';
                ctx.fillRect(x,y,1,1);
            }
            if (v == 3) {
                ctx.fillStyle = '#009900';
                ctx.fillRect(x,y,1,1);
            }
        }
    }

    grid.render(ctx);
    requestAnimationFrame(render);
}
