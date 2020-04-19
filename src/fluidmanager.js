export class FluidManager {
    constructor() {
        this.particles = [];
    }

    update(grid, dt) {
        while (this.particles.length < 2000) {
            let a = Math.random() * 2 * Math.PI;
            this.particles.push(new FluidParticle(300*4 + Math.sin(a) * 280*4, 300*4 + Math.cos(a) * 280*4));
        }

        const kNear = .1;
        const k = .05;
        const restDensity = 1;
        const radius = 20;
        const visc = .003;
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].deleteFlag) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            particle.vel.x += particle.force.x;
            particle.vel.y += particle.force.y;
            particle.vel.x *= .999;
            particle.vel.y *= .999;
            particle.pos.x += particle.vel.x*dt;
            particle.pos.y += particle.vel.y*dt;
            particle.force.x = 0;
            particle.force.y = 0;
            particle.density = 0;
            particle.densityNear = 0;
            particle.neighbors = [];

            let dx = particle.pos.x - 300*4;
            let dy = particle.pos.y - 300*4;
            let dist = Math.sqrt(dx*dx + dy*dy);
            dx /= dist;
            dy /= dist;
            particle.force.x = -dx*.01;
            particle.force.y = -dy*.01;
            this.collideGrid(grid, particle);
        }
        for (let i = 0; i < this.particles.length; i++) {
            let particle1 = this.particles[i];
            for (let j = i+1; j < this.particles.length; j++) {
                let particle2 = this.particles[j];
                let dx = particle2.pos.x - particle1.pos.x;
                let dy = particle2.pos.y - particle1.pos.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < radius) {
                    let q = 1 - dist / radius;
                    let qsq = q*q;
                    particle1.density += qsq;
                    particle1.densityNear += q*qsq;
                    particle2.density += qsq;
                    particle2.densityNear += q*qsq;
                    particle1.neighbors.push(new Neighbor(particle2, dx, dy, dist, q));
                }
            }
        }
        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            particle.pressure = k*(particle.density - restDensity);
            particle.pressureNear = kNear*particle.densityNear;
        }
        for (let i = 0; i < this.particles.length; i++) {
            let particle1 = this.particles[i];
            for (let j = 0; j < particle1.neighbors.length; j++) {
                let neighbor = particle1.neighbors[j];
                let particle2 = neighbor.particle;
                let dm = neighbor.q*(particle1.pressure + particle2.pressure + (particle1.pressureNear + particle2.pressureNear)*neighbor.q);

                let viscX = (particle2.vel.x - particle1.vel.x) * neighbor.q * visc;
                let viscY = (particle2.vel.y - particle1.vel.y) * neighbor.q * visc;

                let forceX = dm * neighbor.dx / neighbor.dist - viscX;
                let forceY = dm * neighbor.dy / neighbor.dist - viscY;

                particle1.force.x -= forceX;
                particle1.force.y -= forceY;
                particle2.force.x += forceX;
                particle2.force.y += forceY;
            }
        }
    }

    collideGrid(grid, particle) {
        let tileSize = grid.tileSize;
        const radius = 10;
        let gx = Math.floor(particle.pos.x / tileSize);
        let gy = Math.floor(particle.pos.y / tileSize);
        let blockRadius = Math.ceil(radius / tileSize); 
         for (let x = -blockRadius; x <= blockRadius; x++) {
            for (let y = -blockRadius; y <= blockRadius; y++) {
               let rX = x+gx;
                let rY = y+gy;
                if (grid.boundsCheck(rX, rY)) {
                    let blockVal = grid.tiles[rX + rY*grid.width];
                    if (blockVal > 1) {
                        if (blockVal === 5 && Math.abs(x) + Math.abs(y) <= 1) {
                            particle.deleteFlag = true;
                            grid.setBlockValue(gx, gy, 5);
                            return;
                        }
                        if (blockVal === 5) {
                            continue;
                        }
                        let coordX = (rX+.5)*tileSize;
                        let coordY = (rY+.5)*tileSize;
                        let diffX = coordX - particle.pos.x;
                        let diffY = coordY - particle.pos.y;
                        let dist = Math.sqrt(diffX*diffX + diffY*diffY);
                        if (dist < radius) {
                            let nx = diffX / dist;
                            let ny = diffY / dist;
                            let radDiff = radius - dist;
                            particle.pos.x -= radDiff * nx;
                            particle.pos.y -= radDiff * ny;
                            particle.vel.x -= nx*.1;
                            particle.vel.y -= ny*.1;
                        }
                    }
                }
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = 'rgba(0,0,255,.5)';
        for (let p of this.particles) {
            ctx.fillRect(p.pos.x-5, p.pos.y-5, 10, 10);
        }
    }
}

class Neighbor {
    constructor(particle, dx, dy, dist, q) {
        this.particle = particle;
        this.dx = dx;
        this.dy = dy;
        this.dist = dist;
        this.q = q;
    }
}

export class FluidParticle {
    constructor(x, y) {
        this.pos = {x,y};
        this.vel = {x:0, y:0};
        this.pressure = 0;
        this.pressureNear = 0;
        this.force = {x:0, y:0};
        this.density = 0;
        this.densityNear = 0;
        this.neighbors = [];
    }
}