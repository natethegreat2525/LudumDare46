export class Ball {
    constructor(pos, vel) {
        this.pos = pos;
        this.vel = vel;
    }

    render(ctx) {
        ctx.setTransform(1, 0, 0, 1, this.pos[0], this.pos[1]);
        ctx.fillStyle = 'rgba(255,0,0,.5)';
        ctx.fillRect(-5, -5, 10, 10);
    }

    update() {
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];

        if (this.pos[0] < 0) {
            this.pos[0] = 0;
            this.vel[0] *= -1;
        }
        if (this.pos[1] < 0) {
            this.pos[1] = 0;
            this.vel[1] *= -1;
        }
        if (this.pos[0] > 800) {
            this.pos[0] = 800;
            this.vel[0] *= -1;
        }
        if (this.pos[1] > 600) {
            this.pos[1] = 600;
            this.vel[1] *= -1;
        }
    }
}