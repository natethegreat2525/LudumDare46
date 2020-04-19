import { Mouse } from "./mouse";
import { Key } from "./key";
import { Bullet } from "./bullet";

export class Player {
    constructor(x, y) {
        this.type = "player";
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
        this.maxVel = 500000;
        this.radius = 10;
        this.health = 100;
        this.shootCooldown = 0;
    }

    update(manager, grid, dt) {
        let mdx = Mouse.x - Mouse.width/2;
        let mdy = Mouse.y - Mouse.height/2;
        let camAngle = manager.cam.angle;

        this.angle = Math.atan2(mdy, mdx) + camAngle;

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

        this.vx *= .9;
        this.vy *= .9;

        this.collideClosestGrid(grid);

        this.shootCooldown -= dt;

        if (Mouse.leftDown && this.shootCooldown < 0) {
            this.shootCooldown = .2;
            manager.addEntity(new Bullet({x: this.x, y: this.y}, {x: Math.cos(this.angle)*500, y: Math.sin(this.angle)*500}));
        }
    }

    collideClosestGrid(grid) {
        let tileSize = grid.tileSize;
        let gx = Math.floor(this.x / tileSize);
        let gy = Math.floor(this.y / tileSize);
        let blockRadius = Math.ceil(this.radius / tileSize); 
        let closest = 9999;
        let nx = 0;
        let ny = 0;
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
                        if (dist < closest) {
                            closest = dist;
                            nx = diffX/dist;
                            ny = diffY/dist;
                        }
                    }
                }
            }
        }
        if (closest < this.radius) {
            let fixDist = this.radius - closest;
            this.x -= fixDist*nx;
            this.y -= fixDist*ny;
            this.vx *= .5;
            this.vy *= .5;
        }
    }

    render(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillRect(-10, -10, 20, 20);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(10, -2, 4, 4);
        ctx.rotate(-this.angle);
        ctx.translate(-this.x, -this.y)
    }
}