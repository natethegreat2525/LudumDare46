export class Grid {
    constructor(l, w) {
        this.length = l;
        this.width = w;
        this.tileSize = 8;
        this.tiles = new Int8Array(l * w);
        this.colors = [null, "#444444", "#765432", "#888888", "#009900"];
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
        return x >= 0 && y >= 0 && x < this.width && y < this.length;
    }

    render(ctx, offsX, offsY, sizeX, sizeY) {
        offsX = Math.floor(offsX);
        offsY = Math.floor(offsY);
        sizeX++;
        sizeY++;
        for (let x = 0; x < sizeX; x++) {
            for (let y = 0; y < sizeY; y++) {
                let rX = x + offsX;
                let rY = y + offsY;
                if (this.boundsCheck(rX, rY)) {
                    let value = this.tiles[this.getIndex(rX, rY)];
                    let color = this.colors[value];
                    if (color) {
                        if (color !== ctx.fillStyle) {
                            ctx.fillStyle = color;
                        }
                        ctx.fillRect(rX*this.tileSize, rY*this.tileSize, this.tileSize, this.tileSize);
                    }
                }
            }
        }
    }
}