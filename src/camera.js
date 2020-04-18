import { Key } from "./key";

export class Camera {
    constructor(l, w, startVec) {
        this.length = l;
        this.width = l;
        this.zoom = 1.00;
        this.position = {
            x: startVec.x,
            y: startVec.y,
        }
    }

    update(ctx, vec, subVec) {
        if (Key.isHit(Key.Z)) {
            this.zoom += 0.25;
        }
        if (Key.isHit(Key.B)) {
            this.zoom -= 0.25;
        }
        this.position.x = vec.x - subVec.x;
        this.position.y = vec.y - subVec.y;
    }
}