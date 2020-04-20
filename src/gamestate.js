import { Key } from "./key";
import { generatePlanet } from "./terrain";
import { FluidManager, FluidParticle } from "./fluidmanager";
import { Player } from "./player";
import { Grid } from "./grid";
import { EntityManager } from "./entitymanager";
import { level_configs } from "./levels";
import { Camera } from "./camera";
import { Eater } from "./eater";

export class GameState {
    constructor(screenW, screenH) {
        this.inMainMenu = true;
        this.isPlaying = false;
        this.currentlyDead = false;
        this.deathCount = 0;
        this.levelCount = 0;
        this.grid = null;
        this.player = null;
        this.fluidManager = null;
        this.entityManager = null;
        this.cam = null;
        this.screenH = screenH;
        this.screenW = screenW;
    }

    start(mainMenu) {
        this.grid = new Grid(600, 600);
        this.cam = new Camera(this.screenW, this.screenH, { x: 0, y: 0 });
        this.player = new Player(300*this.grid.tileSize, (300-70)*this.grid.tileSize);
        this.fluidManager = new FluidManager();
        this.entityManager = new EntityManager(this.fluidManager, this.cam);
        this.inMainMenu = mainMenu;
        this.entityManager.addEntity(this.player); this.grid = new Grid(600, 600);
        let levelConfig = level_configs[this.levelCount];
        this.entityManager.levelConfig = levelConfig;

        if (levelConfig.eaters) {
            for (let i = 0; i < levelConfig.eaterCount; i++) {
                let a = Math.random() * Math.PI * 2;
                this.entityManager.addEntity(new Eater(Math.sin(a)*levelConfig.outerRadius*this.grid.tileSize+this.grid.width*this.grid.tileSize/2, Math.cos(a)*levelConfig.outerRadius*this.grid.tileSize + this.grid.width*this.grid.tileSize/2));
            }
        }

        this.grid.tiles = levelConfig.gen();
        for (let x = -40; x < 40; x++) {
            for (let y = -40; y < 40; y++) {
                if (x*x + y*y < 20*20) {
                    this.grid.setBlockValue(300+x,300-67+y, 1);
                }
                if (this.grid.getBlockValue(x+300, y+300-67) === 6) {
                    this.grid.setBlockValue(x+300, y+300-67, 1);
                }
            }
        }
        this.processGridForLava();
        this.grid.setBlockValue(300, 300-58, 5);
        for (let i = 0; i < 100; i ++) {
            let d = Math.random() * 15;
            this.grid.setBlockValue(300 + Math.floor(Math.random() * d-d/2), 300-58 +Math.floor(d), 5);
        }
        this.grid.buildChunks();
    }

    reset() {
        this.currentlyDead = false;
        this.deathCount++;
        this.levelCount = 0;
        this.start(false);
    }

    update(dt) {
        this.grid.rebuildDirty();
        this.fluidManager.update(this.grid, 1, this.entityManager);
        this.grid.update();
        if (this.player.health < 0) {
            this.currentlyDead = true;
            if (Key.isHit(Key.R)) {
                this.reset();
            }
        }
        if (!this.currentlyDead) {
            this.entityManager.update(this.grid, dt);
        }
        this.checkWin();
    }

    checkWin() {
        if (this.grid.totalPurple <= 0) {
            this.levelCount = 0;
            this.start();
        }
        if (this.grid.totalPurple >= this.entityManager.levelConfig.goal) {
            this.levelCount++;
            this.start(false);
        }
    }

    processGridForLava() {
        for (let x = 0; x < this.grid.width; x++) {
            for (let y = 0; y < this.grid.height; y++) {
                if (this.grid.tiles[x + y*this.grid.width] === 6) {
                    //lava
                    this.grid.tiles[x + y*this.grid.width] = 1;
                    if (Math.random() > .9) {
                        this.fluidManager.particles.push(new FluidParticle(x*this.grid.tileSize, y*this.grid.tileSize, 1));
                    }
                }
            }
        }
    }
}
