export class HUD {
    constructor(w, h) {
        this.height = h;
        this.width = w;
        this.hitAnimation = false;
        this.hitAnimationLength = 100;
        this.currentHitAnimationLength = 100;
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
        if (player.hit || this.hitAnimation) {
            this.hitAnimation = true;
            let alpha = 0.5 * (this.currentHitAnimationLength / this.hitAnimationLength);
            ctx.fillStyle = 'rgba(255, 0, 0, ' + alpha +  ')';
            ctx.fillRect(0, 0, this.width, this.height);
            this.currentHitAnimationLength--;
            if (this.currentHitAnimationLength < 0) {
                this.currentHitAnimationLength = 50;
                this.hitAnimation = false;
            }
        }
        /*
        ROOT health?
        ctx.fillStyle = 'rgba(255, 255, 255, .8)';
        ctx.fillRect(this.width-110, this.height-20, 100, 10);
        */
    }
}