//import { Key } from "./key";
import { Mouse } from "./mouse";
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
    let vec = {x: 0, y: 0};
    let lastVec = {x: 0, y: 0};
    let padding = 10;
    for (let i = 0; i < grid.tiles.length; i++) {
        vec = grid.getVector2(i);
        vec.x *= grid.tileSize;
        vec.y *= grid.tileSize;
        ctx.fillRect(vec.x, vec.y, grid.tileSize-1, grid.tileSize-1);
        lastVec = vec;
    }
    requestAnimationFrame(render);
}
