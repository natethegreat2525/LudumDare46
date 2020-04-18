import { Key } from "./key";

export class Camera {
    constructor(w, h, startVec) {
        this.height = h;
        this.width = w;
        this.zoom = 1.00;
        this.position = {
            x: startVec.x,
            y: startVec.y,
        };
        this.healthText = "health: ";
        this.playerPositionText = "position: ";
        this.image = null;
    }

    buildHUD(player) {
        let canv = document.createElement('canvas');
        canv.width = this.height;
        canv.height = this.width;
        let ctx = canv.getContext('2d');
        ctx.font = '24px serif';
        ctx.fillStyle = "rgba(50, 200, 20, 0.8)";
        let t = this.healthText + player.health
        let text = ctx.measureText(t);
        let x = player.x;
        let y = player.y;
        ctx.fillText(t, x, y);
        var newImage = new Image();
        newImage.onload = () => {
            this.image = newImage;
        }
        newImage.src = canv.toDataURL('image/png');
    }

    update(vec) {
        if (Key.isHit(Key.Z)) {
            this.zoom += 0.1;
        }
        if (Key.isHit(Key.B)) {
            this.zoom -= 0.1;
        }
        this.position.x = vec.x;
        this.position.y = vec.y;
    }

    getCorner() {
        return {x: this.position.x, y: this.position.y};
    }

    renderHUD(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.position.x, this.position.y);
        }
    }
}