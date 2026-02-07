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

// ROTINAS ESPECIAIS =====================================

// INICIALIZANDO O CANVAS
let startCanvas = () => {
    window.canvas = document.getElementById('canvas');
    window.ctx = canvas.getContext('2d');
    window.COR_FUNDO = 'thistle';
}

// desenha uma linha entre pontos
let drawLine = (x1, y1, x2, y2, cor, esp) => {
    defCor(cor);
    defEspessura(esp);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// desenha uma linha tracejada
let drawDashedLine = (x1, y1, x2, y2, cor, esp) => {
    defCor(cor);
    defEspessura(esp)
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
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

// desenha um círculo aberto
let desenhaCirculo = (x0, y0, raio, esp, cor) => {
    defCor(cor);
    defEspessura(esp);
    ctx.beginPath();
    ctx.arc(x0, y0, raio, 0, 2 * Math.PI);
    ctx.stroke();
}

// desenha um círculo cheio
let pintaCirculo = (x0, y0, raio, cor) => {
    defCor(cor);
    ctx.beginPath();
    ctx.arc(x0, y0, raio, 0, 2 * Math.PI);
    ctx.fill();
}

// escreve um texto
let printText = (texto, x, y, cor) => {
    defCor(cor);
    ctx.font = "italic 30px Times New Roman";
    ctx.fillText(texto, x, y);
}


// limpa a tela
let cls = () => {
    let w = canvas.width;
    let h = canvas.height;
    defCor(COR_FUNDO);
    drawRect(0, 0, w, h);
}


// temporizador
let iniciaTemporizador = (fps) => {
    setInterval(
        () => {
            showScreen();
        }, 1000 / fps
    );
}

// AQUI É ONDE AS COISAS ACONTECEM =====================================
let showScreen = () => {
    cls();

    // captura parâmetros da interface
    eX = document.getElementById('escala-x').value;
    eY = document.getElementById('escala-y').value;

    pintaIntegral(posX);
    desenhaEixos();
    desenhaGrafico();

    // desenho da reta tangente
    desenhaTangente((posX - 250)/eX);

    // efetuando o movimento do ponto de tangência
    if (dir > 0) {
        posX += 2;
        if (posX >= 500) {
            dir = -1;
            posX = 500;
        }
    } else {
        posX -= 2;
        if (posX <= 0) {
            dir = 1;
            posX = 0;
        }
    }
    

}

// desenha os eixos coordenados
let desenhaEixos = () => {
    // quadriculados no fundo
    let qtdX = Math.floor(250/eX);
    let qtdY = Math.floor(250/eY);
    for(let i = 1; i <= qtdX; i++) {
        drawLine(250 + i*eX, 0, 250 + i*eX, 500, 'white', 1);
        drawLine(250 - i*eX, 0, 250 - i*eX, 500, 'white', 1);
    }
    for (let i = 0; i <= qtdY; i++) {
        drawLine(0, 250 - i*eY, 500, 250 - i*eY, 'white', 1);
        drawLine(0, 250 + i*eY, 500, 250 + i*eY, 'white', 1);
    }

    // eixo X
    drawLine(0, 250, 500, 250, 'black', 2);
    drawLine(500, 250, 490, 240, 'black', 2);
    drawLine(500, 250, 490, 260, 'black', 2);

    // eixo Y
    drawLine(250, 0, 250, 500, 'black', 2);
    drawLine(250, 0, 240, 10, 'black', 2);
    drawLine(250, 0, 260, 10, 'black', 2);

    printText('x', 470, 250 + 22, 'black');
    printText('y', 265, 22, 'black');
}

// desenha o gráfico da função
let desenhaGrafico = () => {
    let x = 0;
    let y = 0;
    let yy = 0;
    for (let xx = 0; xx < 500; xx += 0.5) {
        x = (xx - 250)/eX; y = (250 - yy)/eY;
        yy = 250 - eY*f(x);
        drawRect(xx - 2, yy - 2, 5, 5, 'steelblue');
    }
}

// função a ser apresentada no gráfico
let f = x => {
    // return Math.sin(x)/x;
    return 2*(x/2 + 1)**3 - 4*(x/2 + 1)**2 + 1;
    // return x**4 - 6*x**2 + 4;
}

// derivada da função
let df = x => {
    return 3*(x/2 + 1)**2 - 2*x -4;
}

// desenha uma reta tangente
let desenhaTangente = x => {
    // reta tangente
    let x0 = x;
    let y0 = f(x0);
    let m = df(x0);
    let yy0 = 250 + 250*m*eY/eX + eY*(m*x0 - y0);
    let yy1 = 250 - 250*m*eY/eX + eY*(m*x0 - y0);
    drawLine(0, yy0, 500, yy1, 'red', 3);
    // ponto de tangência
    let xx = 250 + eX*x0;
    let yy = 250 - eY*y0;
    // drawRect(xx - 6, yy - 6, 12, 12, 'white');
    // pintaCirculo(xx, yy, 6, 'white');
    pintaCirculo(xx,yy, 6, 'black');

}

let pintaIntegral = xx => {
    let y = 0;
    let x = 0;
    let pY = 0;
    let pX = 0;
    for (let pX = 0; pX <= xx; pX++) {
        x = (pX - 250)/eX;
        y = f(x);
        pY = 250 - eY*y;
        drawLine(pX, 250, pX, pY, 'rgb(218, 165, 32, 0.6)', 1);
    }
    pX = posX;
    x = (pX - 250)/eX;
    y = f(x);
    pY = 250 - eY*y;
    drawDashedLine(250, pY, pX, pY, 'black', 2);
    drawDashedLine(pX, 250, pX, pY, 'black', 2);
    drawRect(250 - 4, pY - 4, 9, 9, 'black');
    drawRect(pX - 4, 250 - 4, 9, 9, 'black');
    printText('x', pX + 6, 250 + 22, 'darkred');
    printText('y', 250 - 22, pY + 22, 'darkred');
    // printText('x', 470, 250 + 22, 'black');
    // printText('y', 265, 22, 'black');

}



// ****************************************************************
//   EVENTOS DE INTERAÇÃO COM O USUÁRIO
// ****************************************************************




/* =====================  INÍCIO =====================  */
startCanvas();

var eX = 50;
var eY = 50;

var dir = 1;
var posX = 0;


iniciaTemporizador(30);


