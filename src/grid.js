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
}