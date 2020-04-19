// Entity methods:
// update(entityManager, grid, dt)
// render(context)
// init(entityManager) (optional)
// beforeDelete(entityManager) (optional)

// Entity Fields:
// deleteFlag = false // set to true to delete next update
// type = string type of entity

export class EntityManager {
    constructor(fluidManager) {
        this.entities = [];
        this.fluid = fluidManager;
    }

    resetEntities() {
        this.entities.length = 0;
    }

    addEntity(e) {
        this.entities.push(e);
        e.init && e.init(this);
    }

    update(grid, dt) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(this, grid, dt);
        }

        for (let i = 0; i < this.entities.length; i++) {
            let e = this.entities[i];
            if (e.deleteFlag) {
                e.beforeDelete && e.beforeDelete(this);
                this.entities.splice(i, 1);
                i--;
            }
        }
    }

    render(ctx) {
        this.entities.forEach(e => {
            e.render(ctx);
        });
    }
}