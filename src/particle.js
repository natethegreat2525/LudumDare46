export class Particle {
    // color is of the form "r,g,b"
    // startFade is how many seconds left in the animation before alpha fade
    constructor(pos, vel, color, life, startFade) {
        this.pos = pos;
        this.vel = vel;
        this.life = life;
        this.color = color;
        this.startFade = startFade;
    }

    update(mgr, grid, dt) {
        this.pos.x += this.vel.x*dt;
        this.pos.y += this.vel.y*dt;
        this.life -= dt;
        if (this.life < 0) {
            this.deleteFlag = true;
        }
    }

    render(ctx) {
        let alpha = this.life > this.startFade ? 1 : this.life/this.startFade;
        ctx.fillStyle = "rgba("+this.color+","+alpha+")";
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillRect(-2, -2, 4, 4);
        ctx.translate(-this.pos.x, -this.pos.y);
    }
}