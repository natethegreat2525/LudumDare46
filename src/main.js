import { Ball } from "./ball";
import { Key } from "./key";
import { Mouse } from "./mouse";

let ctx = null;
let balls = [];

function rand(low, high) {
    return Math.random()*(high-low)+low;
}

export function startGame(context) {
    ctx = context;

    Mouse.init(ctx.canvas);

    for (let i = 0; i < 10; i++) {
        balls.push(randomBall());
    }

    if (ctx) {
        requestAnimationFrame(render);
    }
}

function randomBall() {
    return new Ball([rand(0,800), rand(0,600)], [rand(-1,1), rand(-1,1)]);
}

function clear() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function render() {
    clear();

    //console.log(Mouse.x, Mouse.y, Mouse.leftDown, Mouse.rightDown);

    for (let ball of balls) {
        ball.update();
        ball.render(ctx);
    }

    if (Key.isDown(Key.SPACE)) {
        balls.push(randomBall());
    }

    requestAnimationFrame(render);
}