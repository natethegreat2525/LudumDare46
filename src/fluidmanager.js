import { Fire } from "./Fire";

export class FluidManager {
    constructor() {
        this.particles = [];
    }

    resetParticles() {
        this.particles.length = 0;
    }

    deleteParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].deleteFlag) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    update(grid, dt, entityManager) {
        let spawned = 0;
        while (this.particles.length < 4000 && spawned < 10) {
            spawned++;
            let a = Math.random() * 2 * Math.PI;
            this.particles.push(new FluidParticle(300*4 + Math.sin(a) * 280*4, 300*4 + Math.cos(a) * 280*4, 0));
        }

        this.deleteParticles();

        const kNear = .1;
        const k = .05;
        const restDensity = 1;
        const radius = 20;
        const visc = .003;

        let totW = 600*4;
        let totH = 600*4;
        let cellSize = 30;
        let gridsW = Math.ceil(totW/cellSize);
        let gridsH = Math.ceil(totH/cellSize);
        let grids = new Array(gridsW * gridsH).fill(0);
        grids = grids.map(g => new Array());
        
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

            if (particle.type === 2) {
                if (!particle.dryTimer) {
                    particle.dryTimer = 0;
                }
                if (Math.abs(particle.vel.x) + Math.abs(particle.vel.y) > .3) {
                    particle.dryTimer = 0;
                }
                particle.dryTimer++;
                let resist = 1 - Math.max(0, particle.dryTimer - 100) / 400;
                particle.vel.x *= resist;
                particle.vel.y *= resist;
                if (particle.dryTimer > 500) {
                    particle.deleteFlag = true;
                    let baseX = Math.floor(particle.pos.x/grid.tileSize);
                    let baseY = Math.floor(particle.pos.y/grid.tileSize);
                    for (let x = -3; x <= 3; x++) {
                        for (let y = -3; y <= 3; y++) {
                            let d = x*x + y*y;
                            if (d < 4) {
                                grid.setBlockValue(x+baseX, y+baseY, 3);
                            }
                        }
                    }
                }
            }

            let dx = particle.pos.x - 300*4;
            let dy = particle.pos.y - 300*4;
            let dist = Math.sqrt(dx*dx + dy*dy);
            dx /= dist;
            dy /= dist;
            particle.force.x = -dx*.01;
            particle.force.y = -dy*.01;
            this.collideGrid(grid, particle, entityManager);

            let cellX = Math.min(gridsW-1, Math.max(0, Math.floor(particle.pos.x / cellSize)));
            let cellY = Math.min(gridsH-1, Math.max(0, Math.floor(particle.pos.y / cellSize)));
            grids[cellX + cellY*gridsW].push(particle);
        }

        const calcGrid = (g1, g2) => {
            if (g1.length === 0 || g2.length === 0) {
                return;
            }
            for (let i = 0; i < g1.length; i++) {
                let particle1 = g1[i];
                for (let j = (g1 === g2 ? i + 1 : 0); j < g2.length; j++) {
                    let particle2 = g2[j];
                    let dx = particle2.pos.x - particle1.pos.x;
                    let dy = particle2.pos.y - particle1.pos.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < radius) {
                        if (particle1.type === 1 && particle2.type === 0) {
                            particle1.type = 2;
                            particle2.deleteFlag = true;
                        }
                        if (particle2.type === 1 && particle1.type === 0) {
                            particle1.deleteFlag = true;
                            particle2.type = 2;
                        }
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
        }

        for (let gw = 0; gw < gridsW; gw++) {
            for (let gh = 0; gh < gridsH; gh++) {
                let cur = grids[gw + gh*gridsW];
                let rightEdge = gw === gridsW-1;
                let lowEdge = gh === gridsH-1;
                if (!rightEdge) {
                    calcGrid(cur, grids[gw+1+gh*gridsW]);
                    if (!lowEdge) {
                        calcGrid(cur, grids[gw+1+(gh+1)*gridsW]);
                        calcGrid(cur, grids[gw+(gh+1)*gridsW]);
                        calcGrid(grids[gw+1+gh*gridsW], grids[gw+(gh+1)*gridsW]);
                    }
                } else if (!lowEdge) {
                    calcGrid(cur, grids[gw+(gh+1)*gridsW]);
                }
                calcGrid(cur,cur);
            }
        }
        
        /*
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
        */
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

                let p1m = 2 * particle1.mass / (particle2.mass + particle1.mass)
                let p2m = 2 * particle2.mass / (particle2.mass + particle1.mass)
                particle1.force.x -= forceX*p2m;
                particle1.force.y -= forceY*p2m;
                particle2.force.x += forceX*p1m;
                particle2.force.y += forceY*p1m;
            }
        }
    }

    collideGrid(grid, particle, entityManager) {
        let tileSize = grid.tileSize;
        let radius = 10;
        if (particle.type === 2) {
            radius = 7;
        }
        let gx = Math.floor(particle.pos.x / tileSize);
        let gy = Math.floor(particle.pos.y / tileSize);
        if (grid.getBlockValue(gx, gy) > 1) {
            particle.vel.x = 0;
            particle.vel.y = 0;
            particle.force.x = 0;
            particle.force.y = 0;
            particle.deleteFlag = true;
            return;
        }
        let blockRadius = Math.ceil(radius / tileSize); 
         for (let x = -blockRadius; x <= blockRadius; x++) {
            for (let y = -blockRadius; y <= blockRadius; y++) {
                let rX = x+gx;
                let rY = y+gy;
                if (grid.boundsCheck(rX, rY)) {
                    let blockVal = grid.tiles[rX + rY*grid.width];
                    if (blockVal > 1) {
                        if (blockVal === 5 && Math.abs(x) + Math.abs(y) <= 1) {
                            if (particle.type === 0) {
                                particle.deleteFlag = true;
                                grid.setBlockValue(gx, gy, 5);
                                return;
                            }
                        }
                        if (blockVal === 5 && particle.type === 0) {
                            continue;
                        }
                        let coordX = (rX+.5)*tileSize;
                        let coordY = (rY+.5)*tileSize;
                        let diffX = coordX - particle.pos.x;
                        let diffY = coordY - particle.pos.y;
                        let dist = Math.sqrt(diffX*diffX + diffY*diffY);
                        if (dist < radius) {
                            if (particle.type === 1 && blockVal === 5) {
                                grid.setBlockValue(rX, rY, 6);
                                entityManager.entities.push(new Fire(rX, rY));
                            }
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
        for (let p of this.particles) {
            let col = 'rgba(50,100,255,.5)';
            if (p.type === 1) {
                col = 'rgba(255,200,0,1)';
            }
            if (p.type === 2) {
                col = 'rgba(200,200,200,1)';
            }
            if (col !== ctx.fillStyle) {
                ctx.fillStyle = col;
            }
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
    constructor(x, y, type) {
        this.mass = type === 1 ? 3 : 1;
        this.type = type;
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