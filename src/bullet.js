import { Particle } from "./particle";

export class Bullet {
    constructor(pos, vel) {
        this.pos = pos;
        this.vel = vel;
    }

    update(mgr, grid, dt) {
        const subStep = 5;
        for (let s = 0; s < subStep; s++) {
            this.pos.x += this.vel.x*dt/subStep;
            this.pos.y += this.vel.y*dt/subStep;

            if (grid.getBlockValue(grid.worldToGrid(this.pos.x), grid.worldToGrid(this.pos.y)) > 1) {
                this.deleteFlag = true;
                let randVel = () => {
                    return Math.random() * 2 - 1;
                }
                for (let i = 0; i < 5; i++) {
                    mgr.addEntity(new Particle({x: this.pos.x, y: this.pos.y}, {x: randVel()*300, y : randVel()*300}, '255,255,255', .1, .1));
                }
                let bx = Math.floor(this.pos.x/grid.tileSize);
                let by = Math.floor(this.pos.y/grid.tileSize);
                for (let x = -10; x <= 10; x++) {
                    for (let y = -10; y < 10; y++) {
                        if (x*x + y*y < 100) {
                            if (grid.getBlockValue(x+bx, y+by) > 1) {
                                grid.setBlockValue(x+bx, y+by, 1);
                            }
                        }
                    }
                }
            }
        }

    }

    render(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillRect(-2, -2, 4, 4);
        ctx.translate(-this.pos.x, -this.pos.y);
    }
}