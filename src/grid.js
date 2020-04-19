import { Key } from "./key";

export class Grid {
    constructor(w, h) {
        this.debugMode = false;
        this.height = h;
        this.width = w;
        this.tileSize = 4;
        this.tiles = null;
        this.colors =          [null, null, "#765432", "#888888", "#009900", "#bb00bb", "#ffff00"];
        this.colorsDark = [null, "#444444", "#382716", "#333333", "#004900", "#660066", "#ffff00"];
        this.chunkWidth = Math.ceil(w/CHUNK_WIDTH);
        this.chunkHeight = Math.ceil(h/CHUNK_WIDTH);
        this.chunks = new Array(this.chunkWidth * this.chunkHeight);
        this.dirtyChunks = new Map();
    }

    worldToGrid(x) {
        return Math.floor(x / this.tileSize);
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

    getChunk(vec) {
        // TODO(nick)
        let x = vec.x / CHUNK_WIDTH;
        let y = vec.y / CHUNK_WIDTH;
        let chunk = this.chunks[x + y];
        return chunk;
    }

    boundsCheck(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    buildChunks() {
        let idx = 0;
        for (let cx = 0; cx < this.chunkWidth; cx++) {
            for (let cy = 0; cy < this.chunkHeight; cy++) {
                let x = cx*CHUNK_WIDTH;
                let y = cy*CHUNK_WIDTH;
                let chunk = new Chunk(idx, x, y);
                chunk.rebuild(this);
                this.chunks[cx + cy*this.chunkWidth] = chunk;
                idx++;
            }
        }
    }

    update() {
        if (Key.isHit(Key.F2)) {
            this.debugMode = !this.debugMode;
            this.buildChunks();
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
        let fixed = [];
        for (let chunk of this.dirtyChunks.values()) {
            fixed.push(chunk);
            if (!chunk.dirty) {
                continue;
            }
            chunk.rebuild(this);
            break;
        }
        fixed.forEach(c => this.dirtyChunks.delete(Math.floor(c.x/CHUNK_WIDTH) + ',' + Math.floor(c.y/CHUNK_WIDTH)));
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

    //renderChunks(ctx, camVec, sizeX, sizeY, zoom) {
    renderChunks(ctx) {
        // TODO(nick): select chunk(s) to render
        for (let x = 0; x < this.chunkWidth; x++) {
            for (let y = 0; y  < this.chunkHeight; y++) {
                let chunk = this.chunks[x + y*this.chunkWidth];
                if (!chunk.image) {
                    //console.log("chunk not found x:" + x + " y: " + y);
                    continue;
                }
                let imageX = x * CHUNK_WIDTH * this.tileSize;
                let imageY = y * CHUNK_WIDTH * this.tileSize;
                ctx.drawImage(chunk.image, imageX, imageY);
            }
        }
        //TODO only render on screen chunks
        //let lowChunkX = Math.floor(offsX / CHUNK_WIDTH);
        //let lowChunkY = Math.floor(offsY / CHUNK_WIDTH);
    }
}

const CHUNK_WIDTH = 64;
class Chunk {
    constructor(idx, x, y) {
        this.idx = idx;
        this.x = x;
        this.y = y;
        this.image = null;
        this.dirty = false;
        this.visited = false;
    }

    rebuild(grid) {
        // TODO(nick): debug visualization
        let padding = 0;
        if (grid.debugMode) {
            padding = 1;
        }
        let canv = document.createElement('canvas');
        canv.width = CHUNK_WIDTH*grid.tileSize+1;
        canv.height = CHUNK_WIDTH*grid.tileSize+1;
        let ctx = canv.getContext('2d');
        
        let extraPx = 0;
        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_WIDTH; y++) {
                if (x === CHUNK_WIDTH-1 || y === CHUNK_WIDTH -1) {
                    extraPx = 1;
                } else {
                    extraPx = 0;
                }
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
                    ctx.fillRect(x*grid.tileSize, y*grid.tileSize, grid.tileSize-padding+extraPx, grid.tileSize-padding+extraPx);
                }
            }
        }
        
        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_WIDTH; y++) {
                if (x === CHUNK_WIDTH-1 || y === CHUNK_WIDTH -1) {
                    extraPx = 1;
                } else {
                    extraPx = 0;
                }
                let rX = x + this.x;
                let rY = y + this.y;
                let value = grid.tiles[rX + rY * grid.width];
                let color = grid.colors[value];
                if (color) {
                    if (color !== ctx.fillStyle) {
                        ctx.fillStyle = color;
                    }
                    ctx.fillRect(x*grid.tileSize, y*grid.tileSize, grid.tileSize-padding+extraPx, grid.tileSize-padding+extraPx);
                }
            }
        }

        if (grid.debugMode) {
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, canv.width - padding, canv.height - padding);
            let t = "chunk #: " + this.idx;
            ctx.font = '24px serif';
            ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            let text = ctx.measureText(t)
            let x = Math.floor((canv.width / 2) - (text.width / 2));
            let y = Math.floor(canv.height - 10);
            ctx.fillText(t, x, y);
        }

        let newImage = new Image();
        newImage.onload = () => {
            this.image = newImage;
        }
        newImage.src = canv.toDataURL('image/png');
    }
}