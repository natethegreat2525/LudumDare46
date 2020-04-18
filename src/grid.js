export class Grid {
    constructor(l, w) {
        this.length = l;
        this.width = w;
        this.tileSize = 8;
        this.tiles = new Int8Array(l * w);
    }

    getIndex(x, y) {
        return x + this.width * y;
    }

    getVector2(index) {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width)
        }
    }

    boundsCheck(x, y) {
        // TODO(nick)
    }

    render(ctx) {
        let vec = {x: 0, y: 0};
        let lastVec = {x: 0, y: 0};
        for (let i = 0; i < this.tiles.length; i++) {
            vec = this.getVector2(i);
            vec.x *= this.tileSize;
            vec.y *= this.tileSize;
            ctx.fillRect(vec.x, vec.y, this.tileSize-1, this.tileSize-1);
            lastVec = vec;
        }
    }
}