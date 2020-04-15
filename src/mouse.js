export const Mouse = {
    x: 0,
    y: 0,
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
    leftDown: false,
    rightDown: false,

    init: function(el) {
        el.onmousemove = (e) => {
            this.ox = this.x;
            this.oy = this.y;
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.vx = this.x - this.ox;
            this.vy = this.y - this.oy;
        }
        el.onmousedown = (e) => {
            if (e.button === 0) {
                this.leftDown = true;
            }
            if (e.button === 2) {
                this.rightDown = true;
            }
        }
        el.onmouseup = (e) => {
            if (e.button === 0) {
                this.leftDown = false;
            }
            if (e.button === 2) {
                this.rightDown = false;
            }
        }
        el.onmouseout = () => {
            this.leftDown = false;
            this.rightDown = false;
        }
    }
};