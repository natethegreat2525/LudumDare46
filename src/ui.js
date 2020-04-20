import { Mouse } from "./mouse";
import { Key } from "./key";

export class UI {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.buttonList = [];
        this.limit = 3;
        this.mode = "MAIN_MENU";
        this.options = [
                        'A', 'B', 'C', 'D', 'E', 'F',
                        'G', 'H', 'I', 'J', 'K', 'L', 
                        'M', 'N', 'O', 'P', 'Q', 'R',
                        'S', 'T', 'U', 'V', 'W', 'X',
                        'Y', 'Z'
                      ];
        this.currentChar = ['A', 'B', 'C'];
    }
    
    setupMainMenu(ctx, highscores) {
        ctx.font = '40px cousine';
        let w = 325;
        let h = 100;
        let p = {
            x: this.x / 2 - w / 2,
            y: this.y / 2 - h / 2 - 200
        };
        let lp = {
                x: this.x / 2 - w / 6,
                y: this.y / 2 + parseInt(ctx.font) / 4 - 200
        };
        let startButton = new Button(w, h, p, lp, 'START');
        startButton.hit = () => {
            return "START_GAME_EVENT";
        }
        this.buttonList.push(startButton);

    }

    update() {
        switch (this.mode) {
        case "MAIN_MENU": {
            if (Mouse.leftHit()) {
                let mousePos = {
                    x: Mouse.x,
                    y: Mouse.y,
                };
                let event = '';
                for (let i = 0; i < this.buttonList.length; i++) {
                    if (this.isInside(mousePos, this.buttonList[i])) {
                        event = this.buttonList[i].hit();
                        if (event === "START_GAME_EVENT") {
                            return false;
                        }
                    }
                }
            }
            return true;
        } break;
        case "HIGH_SCORE_INPUT": {
            return true;
        } break;
        }
    }

    render(ctx, highscores) {
        switch (this.mode) {
        case "MAIN_MENU": {
            for (let i = 0; i < this.buttonList.length; i++) {
                this.buttonList[i].render(ctx);
            }
            // high score board
            ctx.fillStyle = '#000000';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px cousine'; 
            if (highscores && highscores.length > 0) {
                let padding = 425;
                let pitch = 50;
                let x = this.x;
                ctx.fillText('HIGH SCORES  LEVEL   TIME', this.x - padding, parseInt(ctx.font));
                for (let i = 0; i < highscores.length; i++) {
                    ctx.fillText(highscores[i].name, x - padding, parseInt(ctx.font) + pitch);
                    ctx.fillText(highscores[i].level, x - (padding / 2), parseInt(ctx.font) + pitch);
                    ctx.fillText(highscores[i].time, x - (padding / 4), parseInt(ctx.font) + pitch);
                    pitch += 50;
                }
            }
        } break;
        case "HIGH_SCORE_INPUT": {
            ctx.fillStyle = '#000000';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px cousine'; 
            let text = 'ENTER INITIALS: '
            let x = (this.x / 4);
            let y = (this.y / 4);
            let t = ctx.measureText(text);
            ctx.fillText(text, x, y)
            x += t.width;
            for (let i = 0; i < this.limit; i++) {
                if (i >= this.currentChar.length) {
                    break;
                }
                ctx.fillText(this.currentChar[i], x, y);
                x += 50;
            }
        } break;
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
        ctx.font = '40px cousine';
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