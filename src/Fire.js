export class Fire {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 20 + Math.floor(Math.random() * 10);
        this.type = 'fire';
    }

    update(entityManager, grid, dt) {
        this.life--;
        if (this.life == 15) {
            //spread
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (grid.getBlockValue(x+this.x, y+this.y) === 5) {
                        grid.setBlockValue(x+this.x, y+this.y, 6);
                        entityManager.addEntity(new Fire(x+this.x, y+this.y));
                    }
                }
            }
        }
        if (this.life === 0) {
            this.deleteFlag = true;
            grid.setBlockValue(this.x, this.y, 7);
        }
    }

    render() {

    }
}