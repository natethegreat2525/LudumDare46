import { FluidParticle } from "./fluidmanager";

//Worm that digs through the map, spawns randomly when you dig too much
export class Digger {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.turn = (Math.random() - .5) * .03;
        this.history = [];
        this.straightTimer = 4;
        this.type = "digger";
        this.health = 100;
    }

    update(mgr, grid, dt) {
        this.history.unshift({x:this.x, y:this.y});
        if (this.history.length > 40) {
            this.history.pop();
        }
        this.x += Math.sin(this.angle)*3;
        this.y += Math.cos(this.angle)*3;
        this.angle += this.turn;
        this.straightTimer -= dt;
        if (this.straightTimer < 0) {
            this.turn = 0;
            if (this.x < 0 || this.y < 0 || this.x > grid.width*grid.tileSize || this.y > grid.height*grid.tileSize) {
                this.deleteFlag = true;
            }
        }
        let bx = grid.worldToGrid(this.x);
        let by = grid.worldToGrid(this.y);
        for (let x = -5; x <= 5; x++) {
            for (let y = -5; y <= 5; y++) {
                if (x*x + y*y < 10) {
                    if (grid.getBlockValue(x+bx, y+by) > 1) {
                        grid.setBlockValue(x+bx, y+by, 1);
                    }
                }
            }
        }

        for (let ent of mgr.entities) {
            if (ent.type === 'bullet') {
                for (let i = this.history.length-1; i >= 0; i--) {
                    if (i%5 !== 0) {
                        continue;
                    }
                    let dx = ent.pos.x - this.history[i].x;
                    let dy = ent.pos.y - this.history[i].y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist <= 10) {
                        ent.hit = true;
                        this.health -= 20;
                        this.flash = true;
                    }
                }
            }
        }
        if (this.health < 0) {
            this.deleteFlag = true;
            for (let i = 0; i < this.history.length; i++) {
                mgr.fluid.particles.push(new FluidParticle(this.history[i].x + Math.random()*10-5, this.history[i].y+Math.random()*10-5, 1));
            }
        }
    }

    render(ctx) {
        if (this.flash) {
            ctx.fillStyle = '#ff7070';
            this.flash = false;
        } else {
            ctx.fillStyle = '#707070';
        }
        ctx.strokeStyle = '#222222';
        for (let i = this.history.length-1; i >= 0; i--) {
            if (i % 5 !== 0) {
                continue;
            }
            let node = this.history[i];
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
        }
    }
}