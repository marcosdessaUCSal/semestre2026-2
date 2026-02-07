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
    window.COR_FUNDO = 'antiquewhite';
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
let print = (texto, x, y, cor) => {
    defCor(cor);
    ctx.font = "30px Arial";
    ctx.fillText(texto, x, y);
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

    // especifica o tempo
    let t = new Date();
    let h = t.getHours();
    let m = t.getMinutes()
    let s = t.getSeconds();

    // adiantando (ou atrasando) conforme o painel da interface de usuário
    t.setMinutes(m + variacao);
    // recalculando os parâmetros do horário
    h = t.getHours();
    m = t.getMinutes()
    s = t.getSeconds();

    // área circular
    pintaCirculo(250, 250, 240, 'lightgray');
    desenhaCirculo(250, 250, 240, 3, 'gray');

    // números 1 a 12
    for (let i = 1; i <= 12; i++) {
        let teta = 2 * Math.PI / 12 * i;
        let x = 210 * Math.sin(teta) + 250;
        let y = -210 * Math.cos(teta) + 250;
        print(String(i), x - 14, y + 6, 'white');
    }

    // ponteiro horas
    let teta = angHoras(h, m);
    let x = 250 + 120 * Math.sin(teta);
    let y = 250 - 120 * Math.cos(teta);
    drawLine(250, 250, x, y, 'black', 16);

    // ponteiro dos minutos
    teta = angMinutos(m);
    x = 250 + 150 * Math.sin(teta);
    y = 250 - 150 * Math.cos(teta);
    drawLine(250, 250, x, y, 'darkorange', 12);

    // ponteiro dos segundos
    teta = angSegundos(s);
    x = 250 + 200 * Math.sin(teta);
    y = 250 - 200 * Math.cos(teta);
    drawLine(250, 250, x, y, 'red', 6);

    // círculo no centro do relógio
    pintaCirculo(250, 250, 16, 'gray');

    // mostra números no painel digital
    let strHora = String(h).padStart(2, '0');
    let strMinutos = String(m).padStart(2, '0');
    let strSegundos = String(s).padStart(2, '0');
    let painel = document.getElementById('hora-atual');
    painel.innerText = strHora + ':' + strMinutos + ':' + strSegundos

    // quanto ao indicador do adiantamento/atraso (atenção quanto ao sinal negativo!)
    let strAdiantamento = '';
    if (variacao >= 0) {
        strAdiantamento = String(variacao).padStart(3, '0');
    } else {
        strAdiantamento = '-'+ String(Math.abs(variacao)).padStart(3, '0');
    }

    painel = document.getElementById('adiantamento');
    painel.innerText = strAdiantamento

}

// para relógio: calcula ângulo do ponteiro das horas
let angHoras = (hora, minuto) => {
    if (hora >= 12) {
        hora -= 12;
    }
    let teta = 2 * Math.PI / 12 * hora;
    teta += 2 * Math.PI / 12 / 60 * minuto;
    return teta;
}

// para relógio: calcula ângulo do ponteiro dos minutos
let angMinutos = (min) => {
    let teta = 2 * Math.PI / 60 * min;
    return teta;
}

// para o relógio: calcula ângulo do ponteiro dos segundos
let angSegundos = (seg) => {
    let teta = 2 * Math.PI / 60 * seg;
    return teta;
}


// ****************************************************************
//   EVENTOS DE INTERAÇÃO COM O USUÁRIO
// ****************************************************************

// adianta o horário em 5 minutos
let adiantar = () => {
    variacao += 5;
}

// atrasa o horário em 5 minutos
let atrasar = () => {
    variacao -= 5;
}



/* =====================  INÍCIO =====================  */
startCanvas();

var variacao = 0;


iniciaTemporizador(10);


