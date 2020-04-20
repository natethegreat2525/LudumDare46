import { Mouse } from "./mouse";

export class UI {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.buttonList = [];
    }
    
    setupMainMenu(ctx) {
        ctx.font = '40px cousine';
        let w = 325;
        let h = 100;
        let p = {
            x: this.x / 2 - w / 2,
            y: this.y / 2 - h / 2
        };
        let lp = {
                x: this.x / 2 - w / 6,
                y: this.y / 2 + parseInt(ctx.font) / 4
        };
        let startButton = new Button(w, h, p, lp, 'START');
        startButton.hit = () => {
            return "START_GAME_EVENT";
        }
        this.buttonList.push(startButton);
    }

    update(ctx) {
        // check which button mouse is inside
        if (Mouse.leftHit()) {
            let mousePos = {
                x: Mouse.x,
                y: Mouse.y,
            };
            let event = '';
            for (let i = 0; i < this.buttonList.length; i++) {
                console.log(mousePos);
                console.log(this.buttonList[i].position);
                if (this.isInside(mousePos, this.buttonList[i])) {
                    event = this.buttonList[i].hit();
                    if (event === "START_GAME_EVENT") {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    render(ctx) {
        for (let i = 0; i < this.buttonList.length; i++) {
            this.buttonList[i].render(ctx);
        }
    }

    isInside(pos, rect){
        let r = pos.x > rect.position.x && 
                pos.x < rect.position.x+rect.w && 
                pos.y < rect.position.y+rect.h && 
                pos.y > rect.position.y;
        return r; 
    }   
}

export class Button {
    constructor(w, h, pos, lpos, text) {
        this.w = w;
        this.h = h;
        this.position = pos;
        this.labelPosition = lpos;
        this.text = text;
        this.hit = () => {
            console.log('default button hit');
        };
    }

    render(ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y , this.w, this.h); 
        ctx.fillStyle = '#FFFFFF'; 
        ctx.fillStyle = 'rgba(225,225,225,0.5)';
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000'; 
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.text, this.labelPosition.x, this.labelPosition.y);
    }
}