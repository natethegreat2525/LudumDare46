import { Mouse } from "./mouse";
import { Key } from "./key";
import { Bullet } from "./bullet";
import { Particle } from "./particle";

export class Player {
    constructor(x, y) {
        this.type = "player";
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
        this.maxVel = 500000;
        this.radius = 12;
        this.health = 100;
        this.shootCooldown = 0;
        this.hit = false;
    }

    update(manager, grid, dt) {
        let mdx = Mouse.x - Mouse.width/2;
        let mdy = Mouse.y - Mouse.height/2;
        let camAngle = manager.cam.angle;

        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.x > grid.width*grid.tileSize) {
            this.x = grid.width*grid.tileSize;
            this.vx = 0;
        }
        if (this.y > grid.height*grid.tileSize) {
            this.y = grid.height*grid.tileSize;
            this.vy = 0;
        }


        this.angle = Math.atan2(mdy, mdx) + camAngle;
        dt = Math.max(dt, 1.5/60);

        if (Key.isDown(Key.A) || Key.isDown(Key.LEFT)) {
            this.vx -= 500*dt*Math.cos(camAngle);
            this.vy -= 500*dt*Math.sin(camAngle);
        }
        if (Key.isDown(Key.D) || Key.isDown(Key.RIGHT)) {
            this.vx += 500*dt*Math.cos(camAngle);
            this.vy += 500*dt*Math.sin(camAngle);
        }
        if (Key.isDown(Key.W) || Key.isDown(Key.UP)) {
            this.vy -= 500*dt*Math.cos(camAngle);
            this.vx += 500*dt*Math.sin(camAngle);
        }
        if (Key.isDown(Key.S) || Key.isDown(Key.DOWN)) {
            this.vy += 500*dt*Math.cos(camAngle);
            this.vx -= 500*dt*Math.sin(camAngle);
        }

        this.x += this.vx*dt;
        this.y += this.vy*dt;

        this.vx *= .9;
        this.vy *= .9;

        this.collideClosestGrid(grid);

        this.shootCooldown -= dt;

        if (Mouse.leftDown && this.shootCooldown < 0) {
            this.shootCooldown = .2;
            manager.addEntity(new Bullet({x: this.x, y: this.y}, {x: Math.cos(this.angle)*500, y: Math.sin(this.angle)*500}));
        }

        this.hit = false;
        for (let p of manager.fluid.particles) {
            let dx = p.pos.x - this.x;
            let dy = p.pos.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < this.radius) {
                if (p.type === 1) {
                    let randVel = () => {
                        return Math.random() * 2 - 1;
                    }
                    for (let i = 0; i < 1; i++) {
                        manager.addEntity(new Particle({x: this.x, y: this.y}, {x: randVel()*300, y : randVel()*300}, '255,0,0', .2, .2));
                    }
                    this.hit = true;
                    this.health -= .3;
                }
                this.vx = this.vx * .97 + p.vel.x*60*.03;
                this.vy = this.vy * .97 + p.vel.y*60*.03;
                p.vel.x = p.vel.x * .97 + this.vx/60*.03;
                p.vel.y = p.vel.y * .97 + this.vy/60*.03;
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

        var centerX = 0;
        var centerY = 0;
        var shipRadius = 10;
        var cockpitRadius = 4;

        ctx.beginPath();
        ctx.arc(centerX, centerY, shipRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#BCB9B8';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, cockpitRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#2C2C2C';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#22E403';
        ctx.stroke();

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(9, -2, 2, 2);
        ctx.rotate(-this.angle);
        ctx.translate(-this.x, -this.y)
    }
}
