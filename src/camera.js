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
    }

    update(vec) {
        if (Key.isHit(Key.Z)) {
            this.zoom += 0.1;
        }
        if (Key.isHit(Key.B)) {
            this.zoom -= 0.1;
            if (this.zoom <= 0.1) {
                this.zoom = 0.1;
            }
        }
        this.position.x = vec.x;
        this.position.y = vec.y;
    }

    getCorner() {
        return {x: this.position.x, y: this.position.y};
    }
}