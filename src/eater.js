import { Particle } from "./particle";
let cnt = 0;
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
        this.jumpTime = Math.random()*3 + 2;
        this.diffTime = 0;
        this.oldX = 0;
        this.oldY = 0;
        this.eating = false;
        this.totalEaten = 0;
        this.cnt = cnt++;
    }

    update(manager, grid, dt) {
        this.angle = Math.atan2(this.y - grid.height*grid.tileSize/2, this.x - grid.width*grid.tileSize/2)
        dt = Math.max(dt, 1.5/60);
        //console.log(this.cnt, this.x, this.y);
        if (!this.eating) {
            this.diffTime-=dt;
            if (this.diffTime < 0) {
                if (Math.abs(this.x-this.oldX) + Math.abs(this.y-this.oldY) < 10) {
                    this.dir = -this.dir;
                }
                this.diffTime = 3.3;
                this.oldX = this.x;
                this.oldY = this.y;
            }
            
            this.vy -= 200*dt*Math.sin(this.angle);
            this.vx -= 200*dt*Math.cos(this.angle);

            if (this.jumpTime < 0) {
                this.jumpTime += 3 + Math.random()*.1;
                this.vy += 300*Math.sin(this.angle);
                this.vx += 300*Math.cos(this.angle);
            }

            let sx = 80*dt*Math.sin(this.angle);
            let sy = -80*dt*Math.cos(this.angle);
            this.vx += sx*this.dir;
            this.vy += sy*this.dir;

            this.jumpTime -= dt;
        }

        this.x += this.vx*dt;
        this.y += this.vy*dt;

        this.vx *= .99;
        this.vy *= .99;

        if (this.eating) {
            this.vx *= .5;
            this.vy *= .5;
        }

        this.collideClosestGrid(grid, manager);

        for (let p of manager.fluid.particles) {
            let dx = p.pos.x - this.x;
            let dy = p.pos.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < this.radius) {
                if (p.type === 1) {
                    this.health -= 1;
                }
                //this is glitchy for some reason on startup
                this.vx = this.vx * .99 + p.vel.x*60*.01;
                this.vy = this.vy * .99 + p.vel.y*60*.01;
                p.vel.x = p.vel.x * .95 + this.vx/60*.05;
                p.vel.y = p.vel.y * .95 + this.vy/60*.05;
            }
        }

        for (let ent of manager.entities) {
            if (ent.type === 'bullet') {
                let dx = ent.pos.x - this.x;
                let dy = ent.pos.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist <= this.radius) {
                    ent.hit = true;
                    this.health -= 35;
                    this.flash = true;
                }
            }
            if (ent.type === 'eater' && ent !== this) {
                let dx = ent.x - this.x;
                let dy = ent.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist <= this.radius*2) {
                    let nx = dx/dist;
                    let ny = dy/dist;
                    let diffD = this.radius*2 - dist;
                    this.vx -= nx;
                    this.vy -= ny;
                    ent.vx += nx;
                    ent.vy += ny;
                }
            }
        }
        if (this.health <= 0) {
            this.deleteFlag = true;
        }
    }

    collideClosestGrid(grid, mgr) {
        let tileSize = grid.tileSize;
        let gx = Math.floor(this.x / tileSize);
        let gy = Math.floor(this.y / tileSize);
        let blockRadius = Math.ceil(this.radius / tileSize)+4; 
        let radius = 12;
        let wasEating = this.eating;
        this.eating = false;
        for (let x = -blockRadius; x <= blockRadius; x++) {
            for (let y = -blockRadius; y <= blockRadius; y++) {
                let rX = x+gx;
                let rY = y+gy;
                if (grid.boundsCheck(rX, rY)) {
                    let tile = grid.tiles[rX + rY*grid.width];
                    if (tile > 1) {
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
                        if (tile === 5 && dist < radius+4) {
                            this.eating = true;
                            if (dist < radius) {
                                grid.setBlockValue(rX, rY, 1);
                                this.totalEaten++;
                            }
                            this.vx += 20*diffX/dist;
                            this.vy += 20*diffY/dist;
                        }
                        if (dist < radius && wasEating) {
                            grid.setBlockValue(rX, rY, 1);
                        }
                    }
                }
            }
        }
        if (this.totalEaten > 100) {
            mgr.addEntity(new Eater(this.x+1, this.y));
            this.totalEaten = 0;
        }
        if (this.eating && Math.abs(this.vx) + Math.abs(this.vy) < 10) {
            this.vx += 20;
        }
    }

    render(ctx) {
        if (this.flash) {
            ctx.fillStyle = '#ff0000';
            this.flash = false;
        } else {
            ctx.fillStyle = '#009900';
        }
        ctx.lineWidth = 2;
        ctx.translate(this.x, this.y);
        let extraAngle = !this.eating ? 0 : Math.atan2(this.vy, this.vx);
        let negArc = this.eating ? Math.PI/6 : 0;
        ctx.rotate(this.angle + extraAngle);

        ctx.beginPath();
        ctx.arc(0,0,10, negArc+Math.PI/2, 2 * Math.PI-negArc + Math.PI/2, false);
        if (this.eating) {
            ctx.lineTo(0,0);
            ctx.closePath();
        }
        ctx.fill();
        if (!this.eating) {
            ctx.strokeStyle = '#333333';
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0,0);
            if (this.dir === -1 || this.eating) {
                ctx.lineTo(0,10);
            } else {
                ctx.lineTo(0,-10);
            }
            ctx.stroke();
        }

        //ctx.fillRect(-10, -10, 20, 20);

        ctx.rotate(-this.angle-extraAngle);
        ctx.translate(-this.x, -this.y)
    }
}
