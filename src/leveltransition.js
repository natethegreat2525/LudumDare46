import { Mouse } from "./mouse";

export class LevelTransition {
    constructor(message, switchCallback, delay) {
        this.message = message;
        this.switchCallback = switchCallback;
        this.alpha = 0;
        this.fadeIn = true;
        this.wait = 0;
        this.fadeOut = false;
        this.done = false;
        this.delay = delay || 300;
    }

    render(ctx) {
        if (this.fadeIn) {
            this.alpha += .03;
            if (this.alpha > 1) {
                this.alpha = 1;
                this.fadeIn = false;
                this.wait = this.delay;
            }
        } else if (this.wait > 0) {
            this.wait--;
            if (Mouse.leftDown) {
                this.wait = 0;
            }
            if (this.wait === 0) {
                this.switchCallback();
                this.fadeOut = true;
            }
        } else if (this.fadeOut) {
            this.alpha -= .03;
            if (this.alpha < 0) {
                this.alpha = 0;
                this.done = true;
                this.fadeOut = false;
            }
        }

        ctx.font = '30px cousine';
        ctx.fillStyle = "rgba(0,0,0,"+this.alpha+")";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "rgba(255,255,255,"+this.alpha+")";
        let lines = this.message.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let width = ctx.measureText(lines[i]).width;
            let height = 30;
            ctx.fillText(lines[i], (ctx.canvas.width-width)/2, ctx.canvas.height/2 + i*height - lines.length/2*height);
        }
    }
}