export class HUD {
    constructor(w, h) {
        this.height = h;
        this.width = w;
        this.hitAnimation = false;
        this.hitAnimationLength = 100;
        this.currentHitAnimationLength = 100;
    }

    render(ctx, player, gameState) {
        ctx.resetTransform();

        // player health
        ctx.fillStyle = 'rgba(0, 127, 0, 1.0)';
        ctx.fillRect(10, 10, 100, 10);
        if (player.health > 0)  {
            ctx.fillStyle = 'rgba(86, 255, 86, 0.8)';
            ctx.fillRect(10, 10, player.health, 10);
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, .8)';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.font = '40px cousine';
            let text = 'DEAD';
            let t = ctx.measureText(text)
            ctx.fillStyle = 'rgba(255, 0, 0, .8)';
            ctx.fillText(text, this.width/2 - t.width/2, this.height/2);
            text = 'PRESS R TO RESTART'
            t = ctx.measureText(text);
            ctx.fillText(text, this.width/2 - t.width/2, this.height/2 + parseInt(ctx.font) * 2);
        }

        ctx.fillStyle = 'rgba(72, 0, 98, 0.8)';
        ctx.fillRect(10, 30, 100, 10);
        if (gameState.grid.totalPurple > 0) {
            ctx.fillStyle = 'rgba(128, 0, 128, 1.0)';
            let v = 100 * (gameState.grid.totalPurple / gameState.entityManager.levelConfig.goal);
            ctx.fillRect(10, 30, v, 10);
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
    }
}