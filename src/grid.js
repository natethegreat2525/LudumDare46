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

    render() {
        let vec = {x: 0, y: 0};
        let lastVec = {x: 0, y: 0};
        let padding = 10;
        for (let i = 0; i < grid.tiles.length; i++) {
            vec = grid.getVector2(i);
            vec.x *= grid.tileSize;
            vec.y *= grid.tileSize;
            ctx.fillRect(vec.x, vec.y, grid.tileSize-1, grid.tileSize-1);
            lastVec = vec;
        }
    }
}