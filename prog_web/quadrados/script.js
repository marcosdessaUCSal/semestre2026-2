// DEFININDO CLASSES =============================================================
class Coords {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return 'x = ' + this.x + ', y = ' + this.y;
    }
}

class Quadrado {
    constructor() {
        this.v1 = new Coords(0, 0);
        this.v2 = new Coords(0, 0);
        this.v3 = new Coords(0, 0);
        this.v4 = new Coords(0, 0);
        this.cor = 'white';
    }
    girar(coords0, ang) {
        this.v1 = rot(this.v1, coords0, ang);
        this.v2 = rot(this.v2, coords0, ang);
        this.v3 = rot(this.v3, coords0, ang);
        this.v4 = rot(this.v4, coords0, ang);
    }
    getCentro() {
        return { x: (this.v1.x + this.v3.x) / 2, y: (this.v1.y + this.v3.y) / 2 };
    }
}

// ROTINAS ESPECIAIS =====================================
let rot = (coords, coords0, ang) => {
    let x = coords.x;
    let y = coords.y;
    let x0 = coords0.x;
    let y0 = coords0.y;
    let xx = x0 + (x - x0) * Math.cos(ang) - (y - y0) * Math.sin(ang);
    let yy = y0 + (x - x0) * Math.sin(ang) + (y - y0) * Math.cos(ang);
    let novasCoords = new Coords(xx, yy);
    return novasCoords;
}

// INICIALIZANDO O CANVAS
let startCanvas = () => {
    window.canvas = document.getElementById('canvas');
    window.ctx = canvas.getContext('2d');
    window.COR_FUNDO = 'darkslategray';
}

// desenha uma linha entre pontos
let drawLine = (x1, y1, x2, y2, cor, esp) => {
    defCor(cor);
    defEspessura(esp)
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// define cor
let defCor = (cor) => {
    ctx.strokeStyle = cor;
    ctx.fillStyle = cor;
}

// espessura do traço
let defEspessura = esp => {
    ctx.lineWidth = esp;
}

// desenha um retângulo cheio
let drawRect = (x, y, w, h, cor) => {
    defCor(cor);
    ctx.fillRect(x, y, w, h);
}

// limpa a tela
let cls = () => {
    let w = canvas.width;
    let h = canvas.height;
    defCor(COR_FUNDO);
    drawRect(0, 0, w, h);
}

// desenha um quadrado
let desenhaQuadrado = q => {
    // V1 - V2
    drawLine(q.v1.x, q.v1.y, q.v2.x, q.v2.y, q.cor, 6);
    // V2 - V3
    drawLine(q.v2.x, q.v2.y, q.v3.x, q.v3.y, q.cor, 6);
    // V3 - V4
    drawLine(q.v3.x, q.v3.y, q.v4.x, q.v4.y, q.cor, 6);
    // V4 - V1
    drawLine(q.v4.x, q.v4.y, q.v1.x, q.v1.y, q.cor, 6);
    // V1 - V3
    drawLine(q.v1.x, q.v1.y, q.v3.x, q.v3.y, 'lightgreen', 3);
    // V2 - V4
    drawLine(q.v2.x, q.v2.y, q.v4.x, q.v4.y, 'lightgreen', 3);
    // vértices
    drawRect(q.v1.x - 2, q.v1.y - 2, 5, 5, 'white');
    drawRect(q.v2.x - 2, q.v2.y - 2, 5, 5, 'white');
    drawRect(q.v3.x - 2, q.v3.y - 2, 5, 5, 'white');
    drawRect(q.v4.x - 2, q.v4.y - 2, 5, 5, 'white');
    // centro
    drawRect(q.getCentro().x - 3, q.getCentro().y - 3, 7, 7, 'white');
}

// temporizador
let iniciaTemporizador = (fps) => {
    setInterval(
        () => {
            showScreen();
        }, 1000 / fps
    );
}

// AQUI É ONDE AS COISAS ACONTECEM
showScreen = () => {
    cls();

    // unindo os centros dos quadrados
    // 1 e 2
    drawLine(quad1.getCentro().x, quad1.getCentro().y, quad2.getCentro().x, quad2.getCentro().y, 'rgb(19, 44, 44)', 2);
    // 2 e 3
    drawLine(quad2.getCentro().x, quad2.getCentro().y, quad3.getCentro().x, quad3.getCentro().y, 'rgb(19, 44, 44)', 2);
    // 3 e 4
    drawLine(quad3.getCentro().x, quad3.getCentro().y, quad4.getCentro().x, quad4.getCentro().y, 'rgb(19, 44, 44)', 2);
    // 4 e 1
    drawLine(quad4.getCentro().x, quad4.getCentro().y, quad1.getCentro().x, quad1.getCentro().y, 'rgb(19, 44, 44)', 2);


    desenhaQuadrado(quad1);
    desenhaQuadrado(quad2);
    desenhaQuadrado(quad3);
    desenhaQuadrado(quad4);

    switch (n) {
        case 0:
            quad1.girar(quad1.v3, Math.PI / 4 / 15);
            quad2.girar(quad2.v4, Math.PI / 4 / 15);
            quad3.girar(quad3.v1, Math.PI / 4 / 15);
            quad4.girar(quad4.v2, Math.PI / 4 / 15);
            count++;
            break;
        case 1:
            quad1.girar(quad1.v4, Math.PI / 4 / 15);
            quad2.girar(quad2.v1, Math.PI / 4 / 15);
            quad3.girar(quad3.v2, Math.PI / 4 / 15);
            quad4.girar(quad4.v3, Math.PI / 4 / 15);
            count++;
            break;
        case 2:
            quad1.girar(quad1.v1, Math.PI / 4 / 15);
            quad2.girar(quad2.v2, Math.PI / 4 / 15);
            quad3.girar(quad3.v3, Math.PI / 4 / 15);
            quad4.girar(quad4.v4, Math.PI / 4 / 15);
            count++;
            break;
        case 3:
            quad1.girar(quad1.v2, Math.PI / 4 / 15);
            quad2.girar(quad2.v3, Math.PI / 4 / 15);
            quad3.girar(quad3.v4, Math.PI / 4 / 15);
            quad4.girar(quad4.v1, Math.PI / 4 / 15);
            count++;
            break;
        case 4:
            quad1.girar(quad1.v3, Math.PI / 4 / 15);
            quad2.girar(quad2.v4, Math.PI / 4 / 15);
            quad3.girar(quad3.v1, Math.PI / 4 / 15);
            quad4.girar(quad4.v2, Math.PI / 4 / 15);
            count++;
            break;
    }
    if (count == 30) {
        n++;
        count = 0;
        if (n > 4) {
            n = 0;
            // reset quadrado 1
            quad1.v1.x = 0; quad1.v1.y = 500;
            quad1.v2.x = 0; quad1.v2.y = 600;
            quad1.v3.x = 100; quad1.v3.y = 600;
            quad1.v4.x = 100; quad1.v4.y = 500;
            // reset quadrado 2
            quad2.v1.x = 500; quad2.v1.y = 500;
            quad2.v2.x = 500; quad2.v2.y = 600;
            quad2.v3.x = 600; quad2.v3.y = 600;
            quad2.v4.x = 600; quad2.v4.y = 500;
            // reset quadrado 3
            quad3.v1.x = 500; quad3.v1.y = 0;
            quad3.v2.x = 500; quad3.v2.y = 100;
            quad3.v3.x = 600; quad3.v3.y = 100;
            quad3.v4.x = 600; quad3.v4.y = 0;
            // reset quadrado 4
            quad4.v1.x = 0; quad4.v1.y = 0;
            quad4.v2.x = 0; quad4.v2.y = 100;
            quad4.v3.x = 100; quad4.v3.y = 100;
            quad4.v4.x = 100; quad4.v4.y = 0;
            // quanto às cores
            lado++;
            if (lado > 3) {
                lado = 0;
            }
            quad1.cor = colors[(4 - lado + 0) % 4];
            quad2.cor = colors[(4 - lado + 1) % 4];
            quad3.cor = colors[(4 - lado + 2) % 4];
            quad4.cor = colors[(4 - lado + 3) % 4];

        }
    }
}


/* =====================  INÍCIO =====================  */
startCanvas();

let dx = 100;
let n = 0;
let lado = 0;
let count = 0;
let pRot = new Coords(100, 600);
let colors = ['cornflowerblue', 'cadetblue', 'coral', 'orange'];



let quad1 = new Quadrado();
quad1.v1.x = 0; quad1.v1.y = 500;
quad1.v2.x = 0; quad1.v2.y = 600;
quad1.v3.x = 100; quad1.v3.y = 600;
quad1.v4.x = 100; quad1.v4.y = 500;

let quad2 = new Quadrado();
quad2.v1.x = 500; quad2.v1.y = 500;
quad2.v2.x = 500; quad2.v2.y = 600;
quad2.v3.x = 600; quad2.v3.y = 600;
quad2.v4.x = 600; quad2.v4.y = 500;

let quad3 = new Quadrado();
quad3.v1.x = 500; quad3.v1.y = 0;
quad3.v2.x = 500; quad3.v2.y = 100;
quad3.v3.x = 600; quad3.v3.y = 100;
quad3.v4.x = 600; quad3.v4.y = 0;

let quad4 = new Quadrado();
quad4.v1.x = 0; quad4.v1.y = 0;
quad4.v2.x = 0; quad4.v2.y = 100;
quad4.v3.x = 100; quad4.v3.y = 100;
quad4.v4.x = 100; quad4.v4.y = 0;

quad1.cor = colors[0];
quad2.cor = colors[1];
quad3.cor = colors[2];
quad4.cor = colors[3];

iniciaTemporizador(30);


