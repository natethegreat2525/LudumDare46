import { Particle } from "./particle";

export class Eater {
    constructor(x, y) {
        this.type = "eater";
        this.x = x;
        this.y = y;
        this.dir = Math.random() > .5 ? 1 : -1;
        this.vx = 0;
        this.vy = 0;
        this.radius = 12;
        this.health = 100;
        this.shootCooldown = 0;
        this.hit = false;
    }

    update(manager, grid, dt) {
        let camAngle = manager.cam.angle;

        dt = Math.max(dt, 1.5/60);
        if (Key.isDown(Key.A)) {
            this.vx -= 1000*dt*Math.cos(camAngle);
            this.vy -= 1000*dt*Math.sin(camAngle);
        }
        if (Key.isDown(Key.D)) {
            this.vx += 1000*dt*Math.cos(camAngle);
            this.vy += 1000*dt*Math.sin(camAngle);
        }
        if (Key.isDown(Key.W)) {
            this.vy -= 1000*dt*Math.cos(camAngle);
            this.vx += 1000*dt*Math.sin(camAngle);
        }
        if (Key.isDown(Key.S)) {
            this.vy += 1000*dt*Math.cos(camAngle);
            this.vx -= 1000*dt*Math.sin(camAngle);
        }

        this.vx = Math.max(Math.min(this.vx, this.maxVel), -this.maxVel);
        this.vy = Math.max(Math.min(this.vy, this.maxVel), -this.maxVel);

        this.x += this.vx*dt;
        this.y += this.vy*dt;

        this.vx *= .99;
        this.vy *= .99;

        this.collideClosestGrid(grid);

        for (let p of manager.fluid.particles) {
            let dx = p.pos.x - this.x;
            let dy = p.pos.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < this.radius) {
                this.vx = this.vx * .9 + p.vel.x*60*.1;
                this.vy = this.vy * .9 + p.vel.y*60*.1;
                p.vel.x = p.vel.x * .9 + this.vx/60*.1;
                p.vel.y = p.vel.y * .9 + this.vy/60*.1;
            }
        }
    }

    collideClosestGrid(grid) {
        let tileSize = grid.tileSize;
        let gx = Math.floor(this.x / tileSize);
        let gy = Math.floor(this.y / tileSize);
        let blockRadius = Math.ceil(this.radius / tileSize); 
        let radius = 12;
        for (let x = -blockRadius; x <= blockRadius; x++) {
            for (let y = -blockRadius; y <= blockRadius; y++) {
                let rX = x+gx;
                let rY = y+gy;
                if (grid.boundsCheck(rX, rY)) {
                    if (grid.tiles[rX + rY*grid.width] > 1) {
                        let coordX = (rX+.5)*tileSize;
                        let coordY = (rY+.5)*tileSize;
                        let diffX = coordX - this.x;
                        let diffY = coordY - this.y;
                        let dist = Math.sqrt(diffX*diffX + diffY*diffY);
                        if (dist < radius) {
                            let nx = diffX/dist;
                            let ny = diffY/dist;
                            this.x -= nx*(radius-dist);
                            this.y -= ny*(radius-dist);
                            this.vx -= nx*.2;
                            this.vy -= ny*.2;
                            this.vy *= .9;
                            this.vx *= .9
                        }
                    }
                }
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillRect(-10, -10, 20, 20);

        ctx.rotate(-this.angle);
        ctx.translate(-this.x, -this.y)
    }
}
