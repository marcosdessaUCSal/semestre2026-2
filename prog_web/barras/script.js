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

class Aluno {
    constructor(nome, matricula, nota) {
        this.nome = nome;
        this.matricula = matricula;
        this.nota = nota;
    }
}

class Turma {
    constructor() {
        this.alunos = [];
    }

    // adiciona um aluno
    addAluno(aluno) {
        this.alunos.push(aluno);
    }
}


// ROTINAS ESPECIAIS =====================================

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
    ctx.setLineDash([]);
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
    ctx.font = "20px Courier New";
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

    desenhaMedia();
    desenhaFundo();
    desenhaColunaMatriculas();
    desenhaBarrasNotas();

    proporcao += 0.02;
    if (proporcao >= 1) {
        proporcao = 1;
    }

}

// desenha o fundo
let desenhaFundo = () => {
    drawLine(150, 50, 150, 360, 'rgb(51, 153, 102)', 2);
    drawLine(150, 350, 650, 350, 'rgb(51, 153, 102)', 2)
    for (let i = 1; i <= 5; i++) {
        drawDashedLine(i * 100 + 150, 50, i * 100 + 150, 360, 'rgb(51, 153, 102)', 2);
        printText(String(i * 2), i * 100 + 143, 380, 'beige');
    }
    printText('0', 143, 380, 'beige');
    for (let i = 0; i <= 10; i++) {
        drawLine(145, i * 30 + 50, 150, i * 30 + 50, 'rgb(51, 153, 102)', 2)
    }
    printText('Matrícula', 20, 30, 'beige');
    let strTurma = '';
    switch (turma) {
        case turma1:
            strTurma = 'Notas da Turma 1';
            break;
        case turma2:
            strTurma = 'Notas da Turma 2';
            break;
    }
    printText(strTurma, 200, 30, 'beige');
}

// coluna das matrículas dos alunos
let desenhaColunaMatriculas = () => {
    for (let i = 0; i < turma.alunos.length; i++) {
        printText(turma.alunos[i].matricula, 15, 70 + i * 30, 'orange')
    }
}

// barras com as notas dos alunos
let desenhaBarrasNotas = () => {
    let nota = 0;
    for (let i = 0; i < turma.alunos.length; i++) {
        nota = turma.alunos[i].nota;
        drawRect(151, 30 * i + 50 + 4, 500 * proporcao * nota / 10, 20, 'rgba(184, 134, 11, 0.4)');
        drawLine(151, 30 * i + 50 + 4, 151 + 500 * proporcao * nota / 10, 30 * i + 50 + 4, 'orange', 2);
        drawLine(151 + 500 * proporcao * nota / 10, 30 * i + 54, 151 + 500 * proporcao * nota / 10, 30 * i + 54 + 20, 'orange', 2);
    }
}

// média das notas
let desenhaMedia = () => {
    // calcula média
    let soma = 0;
    for (let i = 0; i < turma.alunos.length; i++) {
        soma += turma.alunos[i].nota;
    }
    let media = soma / turma.alunos.length;
    drawRect(150, 50, 500 * media * proporcao / 10, 300, 'rgba(178, 34, 34, 0.4');
    drawDashedLine(151 + 500 * proporcao * media / 10, 0, 151 + 500 * proporcao * media / 10, 500, 'rgba(184, 134, 11, 1)', 2);
    drawRect(151, 400, 500 * proporcao * media / 10, 20, 'rgba(184, 134, 11, 1)');
    printText('Média', 50, 415, 'orange')
    printText(String(media.toFixed(2)), 160 + 500 * proporcao * media / 10, 415, 'orange')
}



// ****************************************************************
//  MOCKAGEM DOS DADOS
// ****************************************************************

// inicia as turmas
let startTurmas = () => {
    // turma 1
    turma1.addAluno(new Aluno('Marcos Silva Almeida', '2023011654', 3.2));
    turma1.addAluno(new Aluno('João dos Santos Menezes', '2023010752', 4.5));
    turma1.addAluno(new Aluno('Cláudio Antônio de Jesus', '2023014025', 7.8));
    turma1.addAluno(new Aluno('Fábio Cerqueira da Silva', '2023017365', 1.6));
    turma1.addAluno(new Aluno('Lenir Albuquerque', '2023014780', 10));
    turma1.addAluno(new Aluno('Jorge Augusto Ribeiro Conceição', '2023011122', 2.1));
    turma1.addAluno(new Aluno('Felix Andrade Oliveira', '2023011114', 9.5));
    turma1.addAluno(new Aluno('Miguel Xavier do Nascimento', '2023011432', 6.9));
    turma1.addAluno(new Aluno('Rafael Bitencourt Pacelli', '2023017509', 10));
    turma1.addAluno(new Aluno('Michel Augusto Argolo', '2023011113', 0.5));

    // turma 2
    turma2.addAluno(new Aluno('José Queiroz Alencar', '2023021987', 0.2));
    turma2.addAluno(new Aluno('Mário César Sena', '2023021971', 3.7));
    turma2.addAluno(new Aluno('Teresa Maria dos Anjos', '2023022000', 8.5));
    turma2.addAluno(new Aluno('Roberto Carlos Nascimento', '2023022002', 9.0));
    turma2.addAluno(new Aluno('John Lennon de Almeida', '2023022014', 2.1));
    turma2.addAluno(new Aluno('Alan Turing da Conecição', '2023022021', 7.5));
    turma2.addAluno(new Aluno('Márcia Maria Sales', '2023021989', 5.9));
    turma2.addAluno(new Aluno('Henrique Rodrigues', '2023021998', 9.8));
}



// ****************************************************************
//   EVENTOS DE INTERAÇÃO COM O USUÁRIO
// ****************************************************************

// identifica o nome do aluno, pelas coordenadas do mouse
let identificaNomeAluno = (x, y) => {
    if (x < 15 || x > 150) return '';
    // procura entre os alunos da turma atual
    let resultado = '';
    let yRef = 0;
    for (let i = 0; i < turma.alunos.length; i++) {
        yRef = 50 + i * 30;
        if (y >= 50 + i * 30 && y < 80 + i * 30) {
            resultado = turma.alunos[i].nome + ',  nota: ' + String(turma.alunos[i].nota.toFixed(1));
            return resultado;
        }
    }
    return resultado;
}

let modificarTurma = () => {
    let escolha = document.getElementById('dropbox').value;
    switch (escolha) {
        case '1':
            turma = turma1;
            break;
        case '2':
            turma = turma2;
            break;
    }
    proporcao = 0;
}



/* =====================  INÍCIO =====================  */
startCanvas();

var proporcao = 0;

// criando as turmas
var turma1 = new Turma();
var turma2 = new Turma();

// populando os dados das turmas
startTurmas();

// turma atual
let turmaEscolhida = document.getElementById('dropbox').value;
var turma = turma1;
switch (turmaEscolhida) {
    case 1:
        turma = turma1;
        break;
    case 2:
        turma = turma2;
        break;
}

canvas.addEventListener("mousemove", (e) => {
    let tooltip = document.getElementById('tooltip');
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    let textoObtido = '';

    tooltip.style.left = (e.pageX + 10) + "px";
    tooltip.style.top = (e.pageY + 10) + "px";
    tooltip.style.display = "none";

    // encontrou um nome?
    textoObtido = identificaNomeAluno(mouseX, mouseY);
    if (textoObtido != '') {
        tooltip.innerHTML = textoObtido;
        tooltip.style.display = "block";
    }


});

canvas.addEventListener("mouseout", () => {
    var tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
});


iniciaTemporizador(30);


