export class Grid {
    constructor(l, w) {
        this.length = l;
        this.width = w;
        this.tileSize = 4;
        this.tiles = new Int8Array(l * w);
        this.colors =          [null, null, "#765432", "#888888", "#009900"];
        this.colorsDark = [null, "#444444", "#382716", "#333333", "#004900"];
        this.chunkWidth = Math.ceil(w/CHUNK_WIDTH);
        this.chunkHeight = Math.ceil(l/CHUNK_WIDTH);
        this.chunks = new Array(this.chunkWidth * this.chunkHeight);
        this.dirtyChunks = new Map();
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

    buildChunks() {
        for (let cx = 0; cx < this.chunkWidth; cx++) {
            for (let cy = 0; cy < this.chunkHeight; cy++) {
                let x = cx*CHUNK_WIDTH;
                let y = cy*CHUNK_WIDTH;
                let chunk = new Chunk(x,y);
                chunk.rebuild(this);
                this.chunks[cx + cy*this.chunkWidth] = chunk;
            }
        }
    }

    getBlockValue(x, y) {
        if (!this.boundsCheck(x, y)) {
            return 0;
        }
        return this.tiles[x + y*this.width];
    }

    setBlockValue(x, y, value) {
        if (!this.boundsCheck(x, y)) {
            return 0;
        }
        let idx = x + y * this.width;
        let oldValue = this.tiles[idx];
        if (oldValue !== value) {
            this.tiles[x + y*this.width] = value;
            let chunkX = Math.floor(x / CHUNK_WIDTH);
            let chunkY = Math.floor(y / CHUNK_WIDTH);
            let chunk = this.chunks[chunkX + chunkY*this.chunkWidth];
            chunk.dirty = true;
            this.dirtyChunks.set(chunkX + ',' + chunkY, chunk);
        }

    }

    rebuildDirty() {
        for (let chunk of this.dirtyChunks.values()) {
            if (!chunk.dirty) {
                continue;
            }

            chunk.rebuild(this);
        }
        this.dirtyChunks = new Map();
    }

    /*
    DONT USE, THIS IS SLOW
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
    }*/

    renderChunks(ctx, offsX, offsY, sizeX, sizeY) {
        for (let x = 0; x < this.chunkWidth; x++) {
            for (let y = 0; y  < this.chunkHeight; y++) {
                let chunk = this.chunks[x + y*this.chunkWidth];
                if (!chunk.image) {
                    continue;
                }
                ctx.drawImage(chunk.image, x*CHUNK_WIDTH*this.tileSize, y*CHUNK_WIDTH*this.tileSize);
            }
        }
        //TODO only render on screen chunks
        //let lowChunkX = Math.floor(offsX / CHUNK_WIDTH);
        //let lowChunkY = Math.floor(offsY / CHUNK_WIDTH);
    }
}

const CHUNK_WIDTH = 64;
class Chunk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = null;
        this.dirty = false;
    }

    rebuild(grid) {
        let canv = document.createElement('canvas');
        canv.width = CHUNK_WIDTH*grid.tileSize;
        canv.height = CHUNK_WIDTH*grid.tileSize;
        let ctx = canv.getContext('2d');
        
        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_WIDTH; y++) {
                let rX = x + this.x - 1;
                let rY = y + this.y - 1;
                if (rX < 0 || rY < 0) {
                    continue;
                }
                let value = grid.tiles[rX + rY * grid.width];
                let color = grid.colorsDark[value];
                if (color) {
                    if (color !== ctx.fillStyle) {
                        ctx.fillStyle = color;
                    }
                    ctx.fillRect(x*grid.tileSize, y*grid.tileSize, grid.tileSize, grid.tileSize);
                }
            }
        }
        
        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_WIDTH; y++) {
                let rX = x + this.x;
                let rY = y + this.y;
                let value = grid.tiles[rX + rY * grid.width];
                let color = grid.colors[value];
                if (color) {
                    if (color !== ctx.fillStyle) {
                        ctx.fillStyle = color;
                    }
                    ctx.fillRect(x*grid.tileSize, y*grid.tileSize, grid.tileSize, grid.tileSize);
                }
            }
        }
        let newImage = new Image();
        newImage.src = canv.toDataURL('image/png');
        newImage.onload = () => {
            this.image = newImage;
        }
    }
}