export class HUD {
    constructor(w, h) {
        this.height = h;
        this.width = w;
    }

    render(ctx, player) {
        // player health
        ctx.resetTransform();
        ctx.fillStyle = 'rgba(86, 255, 86, 1.0)';
        ctx.fillRect(10, 10, 100, 10);
        if (player.health > 0)  {
            ctx.resetTransform();
            ctx.fillStyle = 'rgba(0, 127, 0, .8)';
            ctx.fillRect(10, 10, player.health, 10);
        }
        /*
        ROOT health?
        ctx.fillStyle = 'rgba(255, 255, 255, .8)';
        ctx.fillRect(this.width-110, this.height-20, 100, 10);
        */
    }
}