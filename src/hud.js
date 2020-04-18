export class HUD {
    constructor(w, h) {
        this.height = h;
        this.width = w;
    }

    buildHUD(player) {
    }

    render(ctx) {
        ctx.resetTransform();
        ctx.fillStyle = 'rgba(0, 255, 0, .8)';
        ctx.fillRect(10, 10, 100, 10);
        ctx.fillStyle = 'rgba(255, 255, 255, .8)';
        ctx.fillRect(this.width-110, this.height-20, 100, 10);
    }
}