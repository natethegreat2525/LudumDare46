import { Key } from "./key";
import { generatePlanet } from "./terrain";
import { FluidManager, FluidParticle } from "./fluidmanager";

function processGridForLava(grid, fluidManager) {
    for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
            if (grid.tiles[x + y*grid.width] === 6) {
                //lava
                grid.tiles[x + y*grid.width] = 1;
                if (Math.random() > .9) {
                    fluidManager.particles.push(new FluidParticle(x*grid.tileSize, y*grid.tileSize, 1));
                }
            }
        }
    }
}

export class GameState {
    constructor() {
        this.isPlaying = false;
        this.currentlyDead = false;
        this.deathCount = 0;
        this.levelCount = 1;
    }

    start(grid, player, fluidManager) {
        grid.tiles = generatePlanet(600, "test" + Math.random(), 250, 4, .5, 50);
        for (let x = -40; x < 40; x++) {
            for (let y = -40; y < 40; y++) {
                if (x*x + y*y < 20*20) {
                    grid.setBlockValue(300+x,300-67+y, 1);
                }
                if (grid.getBlockValue(x+300, y+300-67) === 6) {
                    grid.setBlockValue(x+300, y+300-67, 1);
                }
            }
        }
        processGridForLava(grid, fluidManager);
        grid.buildChunks();
        grid.setBlockValue(300, 300-58, 5);
        for (let i = 0; i < 100; i ++) {
            let d = Math.random() * 15;
            grid.setBlockValue(300 + Math.floor(Math.random() * d-d/2), 300-58 +Math.floor(d), 5);
        }
    }

    reset(grid, player, fluidManager) {
        this.currentlyDead = false;
        this.deathCount++;
        this.levelCount = 1;
        player.health = 100;
        this.start(grid, player, fluidManager);
    }

    update(grid, player, fluidManager) {
        if (player.health < 0) {
            this.currentlyDead = true;
            if (Key.isHit(Key.R)) {
                this.reset(grid, player, fluidManager)
            }
        }
    }
}
