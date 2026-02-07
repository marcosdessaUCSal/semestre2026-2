// DEFININDO CLASSES ============================================================================
class Coords {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Figura {
    constructor(img, id, w, h) {
        this.img = img; // objeto do tipo Image
        this.id = id;
        this.w = w;
        this.h = h;
    }
}

class Tela {
    constructor(canvasId) {
        // relativo ao Canvas: conectando-se aos canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // valores default
        this.COR_FUNDO = 'rgb(156, 196, 229)';
        this.corDefault = 'black';
    }

    // BÁSICO: define a cor atual
    defCor(cor) {
        this.corDefault = cor;
    }
    // BÁSICO: espessura do traço
    defEspessura(esp) {
        ctx.lineWidth = esp;
    }
    // BÁSICO: limpa a tela
    cls() {
        let w = this.canvas.width;
        let h = this.canvas.height;
        // this.defCor(this.COR_FUNDO);
        // this.pintaRetangulo(new Coords(0, 0), w, h);
        this.ctx.clearRect(0, 0, w, h);
    }

    // desenha uma linha entre pontos
    desenhaLinha(coords1, coords2) {
        this.ctx.strokeStyle = this.corDefault;
        this.ctx.fillStyle = this.corDefault;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.moveTo(coords1.x, coords1.y);
        this.ctx.lineTo(coords2.x, coords2.y);
        this.ctx.stroke();
    }

    // desenha uma linha tracejada entre pontos
    desenhaLinhaPontilhada(coords1, coords2) {
        this.ctx.strokeStyle = this.corDefault;
        this.ctx.fillStyle = this.corDefault;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(coords1.x, coords1.y);
        this.ctx.lineTo(coords2.x, coords2.y);
        this.ctx.stroke();
    }

    // desenha um retângulo cheio
    pintaRetangulo(coords, w, h) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.corDefault;
        this.ctx.fillStyle = this.corDefault;
        this.ctx.fillRect(coords.x, coords.y, w, h);
    }

    // desenha um retângulo (apenas o contorno)
    desenhaRetangulo(coords, w, h) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.corDefault;
        this.ctx.fillStyle = this.corDefault;
        this.ctx.rect(coords.x, coords.y, w, h);
        this.ctx.stroke();
    }

    // desenha um círculo aberto
    desenhaCirculo(centro, raio) {
        this.ctx.strokeStyle = this.corDefault;
        this.ctx.fillStyle = this.corDefault;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(centro.x, centro.y, raio, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    // pinta um círculo
    pintaCirculo(centro, raio) {
        this.ctx.strokeStyle = this.corDefault;
        this.ctx.fillStyle = this.corDefault;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(centro.x, centro.y, raio, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    // escreve um texto
    escreve(coords, txt) {
        this.ctx.strokeStyle = this.corDefault;
        this.ctx.fillStyle = this.corDefault;
        this.ctx.font = "italic 30px Times New Roman";
        this.ctx.fillText(txt, coords.x, coords.y);
    }

    // exibe uma imagem na tela, dados id e coordenadas
    exibirImg(id, x, y) {
        let fig = listaFigs.find(fig => fig.id == id);
        if (fig == undefined) return;
        this.ctx.drawImage(fig.img, x, y, fig.w, fig.h);
    }

    // exibe uma imagem, mas com controle de rotação, escala e opacidade
    // as coordenadas aqui são do centro (não do vértice esquerdo superior)
    exibirImgEsp(id, x, y, escala, angulo, opacidade) {
        let fig = listaFigs.find(fig => fig.id == id);
        let s = escala / 100;
        if (fig == undefined) return;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(-angulo * Math.PI / 180);
        this.ctx.globalAlpha = opacidade / 100;
        this.ctx.drawImage(fig.img, -s * fig.w / 2, -s * fig.h / 2, s * fig.w, s * fig.h);
        this.ctx.restore();
    }

    // exibe uma imagem, mas mas com controle de escala horizontal ou vertical
    // as coordenadas aqui são do centro (não do vértice esquerdo superior)
    exibirImgProp(id, x, y, escalaX, escalaY) {
        let fig = listaFigs.find(fig => fig.id == id);
        let sX = escalaX / 100;
        let sY = escalaY / 100;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.drawImage(fig.img, -sX * fig.w / 2, -sY * fig.h / 2, sX * fig.w, sY * fig.h);
        this.ctx.restore();
    }

}

// CONSTANTES ===============================================================

// relativo ao Canvas
window.canvas = document.getElementById('canvas');
window.ctx = canvas.getContext('2d');

// lista de todos os arquivos de imaem (sem extensões)
const nomesFiguras = [
    'saiuparaentrega'
];

// objetos de imagens (objetos Figura) - precisa ser gerado em função dos ids
var listaFigs = [];

// pasta onde se encontram as figuras
window.CAMINHO = 'img/';

// formato padrão das imagens importadas
const TIPO = '.png';



// CONTROLE DO TEMPO =====================================================
function iniciaTemporizador(fps, onoff) {
    if (onoff) {
        interval = setInterval(
            () => {
                constroiPainelJogo();
                gestaoDeEmbaralhamento();
            }, 1000 / fps
        );
    } else {
        if (typeof interval === 'undefined') return;
        clearInterval(interval);
    }

}

// DEFINIÇÃO DE EVENTOS DO MOUSE =========================================================
function defineEventoClique() {
    canvas.addEventListener('click', (event) => {
        if (emAnimacao || !emJogo) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const resposta = identificaPecaClicada(x, y);
        jogo.clicarPeca(resposta.i, resposta.j);

    })
}

function defineEventoPresencaDoMouse() {
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // TODO: IMPLEMENTAR AQUI O QUE FAZER

    });
}


// CARREGAMENTO DE IMAGENS DO DISCO =========================================================

async function carregarTodasAsFiguras() {
    for (let indice in listaFigs) {
        try {
            listaFigs[indice].img = await (carregarFigura(listaFigs[indice].id));
        } catch (erro) {
            console.log(erro);
        }
    }
    console.log('carreguei tudo')

}

function carregarFigura(id) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = CAMINHO + id + TIPO;
    });
}

// O objeto imagem é inicialmente nulo, mas deve posteriormente ser instanciado
// com base no id
function defineListaFiguras() {
    listaFigs.push(
        new Figura(null, 'pc1', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc2', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc3', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc4', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc5', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc6', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc7', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc8', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc9', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc10', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc11', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc12', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc13', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc14', 200, 262)
    );
    listaFigs.push(
        new Figura(null, 'pc15', 200, 262)
    );
}





// ISTO AQUI É APENAS DEMONSTRAÇÃO - REMOVER QUANDO FOR DESENVOLVER ALGO
// function desenhaTela() {
//     tela.cls();
//     tela.defCor('blue');

//     teta = -0.2 * t;

//     tela.exibirImgProp('logo', 300, 300, 100*Math.abs(Math.cos(teta)), 100);

//     t++;

// }







// O NÚCLEO DO SEU PROJETO ESTÁ AQUI ============================================

class CoordsPeca {
    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
    }
}

class Movimento {
    construtor() {
        inicio = new CoordsPeca(0, 0);
        destino = new CoordsPeca(0, 0);
        numeroPecaClicada = 0;
    }
}

class Trajetoria {
    constructor() {
        this.proporcao = [];
        this.pontos = [];
        this.escalas = [];
        this.angulos = [];
        this.numQuadros = 0;
    }
    incluir(coords) {
        this.pontos.push(coords);
        this.numQuadros++;
    }
    incluirProp(prop) {
        this.proporcao.push(prop);
    }
    incluirAngulo(ang) {
        this.angulos.push(ang);
    }
}

class PainelJogo {
    constructor() {
        this.matriz = [];
        this.matrizMeta = [];
        this.respMov = new CoordsPeca(0, 0); // para onde a peça se desloca
        this.possivel = false; // se a peça pedia pode ser movida
        this.pecasMoveis = []; // lugares que podem ser clicados (não peças em si)
        this.arrayMoveis = [];
        this.movimento = new Movimento();

        this.iniciaMatriz();
        this.iniciaMatrizMeta();
    }

    iniciaMatriz() {
        this.matriz[0] = [1, 2, 3, 4];
        this.matriz[1] = [5, 6, 7, 8];
        this.matriz[2] = [9, 10, 11, 12];
        this.matriz[3] = [13, 14, 15, 0];
    }

    iniciaMatrizMeta() {
        this.matrizMeta[0] = [1, 2, 3, 4];
        this.matrizMeta[1] = [5, 6, 7, 8];
        this.matrizMeta[2] = [9, 10, 11, 12];
        this.matrizMeta[3] = [13, 14, 15, 0];
    }

    // verificar vitória
    verificar() {
        let resultado = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.matriz[i][j] != this.matrizMeta[i][j]) {
                    resultado = false;
                }
            }
        }
        return resultado;
    }

    // ao ser cahada, atualiza conteudo de 'possivel' (V ou F)
    clicarPeca(pI, pJ) {
        let posVazio = this.procuraVazio();
        let iV = posVazio.linha;
        let jV = posVazio.coluna;
        let deltaI = Math.abs(pI - iV);
        let deltaJ = Math.abs(pJ - jV);
        let cond1 = deltaI == 1 && deltaJ == 0;
        let cond2 = deltaJ == 1 && deltaI == 0;
        if (cond1 || cond2) {
            // para efeito de animação apenas
            this.movimento.inicio = new CoordsPeca(pI, pJ);
            this.movimento.destino = new CoordsPeca(iV, jV);
            this.movimento.numeroPecaClicada = this.matriz[pI][pJ];
            switch (vel) {
                case VEL.DA_LUZ:
                    animacaoSelecionada = ANIMACAO.NADA;
                    emAnimacao = false;
                    break;
                case VEL.LESMA:
                    animacaoSelecionada = ANIMACAO.MOVE_LESMA;
                    emAnimacao = true;
                    break;
                case VEL.NORMAL:
                    animacaoSelecionada = ANIMACAO.MOVE_NORMAL;
                    emAnimacao = true;
                    break;
            }

            // efetiva
            this.possivel = true;
            this.respMov = new CoordsPeca(iV, jV);
            this.matriz[iV][jV] = this.matriz[pI][pJ];
            this.matriz[pI][pJ] = 0;
        } else {
            this.possivel = false;
            emAnimacao = false;
        }
    }

    procuraVazio() {
        let iV = 0;
        let jV = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.matriz[i][j] == 0) {
                    iV = i;
                    jV = j;
                }
            }
        }
        return new CoordsPeca(iV, jV);
    }

    retornaPecasMoveis() {
        this.pecasMoveis.length = 0;
        let coordsVazio = this.procuraVazio();
        let iV = coordsVazio.linha;
        let jV = coordsVazio.coluna;
        // topo
        if (iV > 0) {
            this.pecasMoveis.push(new CoordsPeca(iV - 1, jV));
        }
        // base
        if (iV < 3) {
            this.pecasMoveis.push(new CoordsPeca(iV + 1, jV));
        }
        // esquerda
        if (jV > 0) {
            this.pecasMoveis.push(new CoordsPeca(iV, jV - 1));
        }
        // direita
        if (jV < 3) {
            this.pecasMoveis.push(new CoordsPeca(iV, jV + 1));
        }
        return this.pecasMoveis; // nunca retornará um array vazio
    }
}

// class SeqMov {
//     constructor() {
//         this.local = []; // cada registro é objeto de CoordPeca (que tem linhas e colunas)
//         this.quantidade = 0;
//     }
//     incluir(lc) {
//         this.local.push(lc);
//         this.quantidade++;
//     }
// }



async function iniciar() {
    defineListaFiguras();
    await carregarTodasAsFiguras();
    meuCodigo();
}

function constroiPainelJogo() {

    // if (embaralhando) {
    //     // canvasMaior.hidden = true;
    // }

    if (emAnimacao) {
        // movePeca();
        switch (animacaoSelecionada) {
            case ANIMACAO.MOVE_LESMA:
                movePeca();
                break;
            case ANIMACAO.MOVE_NORMAL:
                movePeca();
                break;
            case ANIMACAO.RECOLHE:
                recolherPecas();
                break;
            case ANIMACAO.ESPALHA:
                espalhaPecas();
                break;
            case ANIMACAO.TRANSPORTA:
                transportaPecas();
                break;
        }
    } else {
        constroiPainelNormal();
        if (emJogo) {
            destacaPecasMoveis();
        }
    }

    // verifica vitória do jogo (DECIDIR SE É NECESSÁRIO)
    if (jogo.verificar()) {
        // TODO: IMPLEMENTAR
    }



}

function constroiPainelNormal() {
    canvasMaior.hidden = true;
    let peca = 0;
    tela.cls();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            peca = jogo.matriz[i][j];
            if (peca != 0) {
                tela.exibirImgEsp('pc' + peca, x0 + j * tX, y0 + i * tY, escala, 0, 100);
            }
        }
    }
    if (aux != AUX.NENHUM && emAnimacao) {
        destacaPecasMoveis();
    }
}

function destacaPecasMoveis() {
    if (aux == AUX.NENHUM) return;
    let pecas = jogo.retornaPecasMoveis();
    let xb = 0;
    let yb = 0;
    let i = 0;
    let j = 0;
    tela.defCor('orange');
    tela.defEspessura(4);
    for (peca of pecas) {
        j = peca.coluna;
        i = peca.linha;
        xb = x0 + j * tX - tX / 2;
        yb = y0 + i * tY - tY / 2;
        if (aux == AUX.RETANGULO) {
            tela.desenhaRetangulo(new Coords(xb, yb), tX, tY);
        } else if (aux == AUX.CIRCULO) {
            tela.desenhaCirculo(new Coords(xb + tX / 2, yb + tY / 2 + 10), 2 * tX / 5);
        }
    }
    return;
}

// resposta i ou j = -1 indica que nenhuma estava ao alcance do clique
function identificaPecaClicada(x, y) {
    let ii = -1;
    let jj = -1;
    let xj = 0;
    let yi = 0;
    // identificando a coluna
    for (let j = 0; j < 4; j++) {
        xj = x0 + j * tX;
        if (xj - tX / 2 <= x && x <= xj + tX / 2) {
            jj = j;
        }
    }
    // identificando a linha
    for (let i = 0; i < 4; i++) {
        yi = y0 + i * tY;
        if (yi - tY / 2 <= y && y <= yi + tY / 2) {
            ii = i;
        }
    }
    return { i: ii, j: jj };
}

// ======== PARTE DAS ANIMAÇÕES ===============================================================

// Não faz nada durante n ciclos
function pausa(n) {
    if (t++ >= n) {
        t = 0;
        return;
    }
}

// constroi todo o tabuleiro durante a animação
function movePeca() {
    // mostra o tabuleiro sem exibir a peça selecionada
    let peca = 0;
    tela.cls();
    telaSuper.cls();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            peca = jogo.matriz[i][j];
            if (
                !(i == jogo.movimento.inicio.linha && j == jogo.movimento.inicio.coluna) &&
                !(i == jogo.movimento.destino.linha && j == jogo.movimento.destino.coluna)
            ) {
                tela.exibirImgEsp('pc' + peca, x0 + j * tX, y0 + i * tY, escala, 0, 100);
            }
        }
    }

    if (aux != AUX.NENHUM && emAnimacao) {
        destacaPecasMoveis();
    }

    // exibindo o movimento
    if (t == 0) {   // só no instante inicial
        canvasMaior.hidden = false;
        if (animacaoSelecionada == ANIMACAO.MOVE_LESMA) {
            traj = obterTrajLesma(jogo.movimento.inicio, jogo.movimento.destino);
        } else if (animacaoSelecionada == ANIMACAO.MOVE_NORMAL) {
            traj = obterTrajNormal(jogo.movimento.inicio, jogo.movimento.destino);
        }
    }
    peca = jogo.movimento.numeroPecaClicada;
    telaSuper.exibirImgEsp('pc' + peca, traj.pontos[t].x + coordsJogo.x - 8,
        traj.pontos[t].y + coordsJogo.y - 97, escala * traj.proporcao[t], traj.angulos[t], 100);
    if (t == traj.numQuadros - 1) {
        emAnimacao = false;
        // canvasMaior.hidden = true;
        t = 0;
    } else {
        t++;
    }
}

// constroi trajetoria normal (vel. constante)
function obterTrajNormal(posInicial, posFinal) {
    let traj = new Trajetoria();
    let pM = 1;
    let T = 8;// número de quadros do movimento
    let alfa = 0;
    let alfaM = Math.PI / 8;

    // vertical ou horizontal?
    if (posInicial.coluna == posFinal.coluna) {
        // é vertical
        alfaM *= Math.sign(posFinal.linha - posInicial.linha);
        let x = x0 + posInicial.coluna * tX;
        let y = 0; // a ser atualizada
        let yI = y0 + posInicial.linha * tY;
        let yF = y0 + posFinal.linha * tY;
        let v = (yF - yI) / T;
        for (let tt = 1; tt < T; tt++) {
            y = yI + v * tt;
            traj.incluir(new Coords(x, y));
        }
    } else {
        // é horizontal
        alfaM *= Math.sign(posFinal.coluna - posInicial.coluna);
        let x = 0;  // a ser atualizada
        let y = y0 + posInicial.linha * tY;
        let xI = x0 + posInicial.coluna * tX;
        let xF = x0 + posFinal.coluna * tX;
        let v = (xF - xI) / T;
        for (let tt = 1; tt < T; tt++) {
            x = xI + v * tt;
            traj.incluir(new Coords(x, y));
        }
    }
    // ajuste de proporções e ângulos de rotação
    let p = 0;
    for (let tt = 0; tt < T; tt++) {
        p = -pM * Math.sin(Math.PI * tt / T) * 0.4 + pM;
        traj.incluirProp(p);
        alfa = 180 * alfaM * Math.sqrt(1 - Math.pow(2 * tt / T - 1, 2)) / Math.PI;
        traj.incluirAngulo(0);
    }
    return traj;
}

// constroi trajetória lesma
function obterTrajLesma(posInicial, posFinal) {
    let traj = new Trajetoria();
    let pM = 1;
    let T = 25;// número de quadros do movimento
    let alfa = 0;
    let alfaM = Math.PI / 12;
    // vertical ou horizontal?
    if (posInicial.coluna == posFinal.coluna) {
        // é vertical
        alfaM *= Math.sign(posFinal.linha - posInicial.linha);
        let x = x0 + posInicial.coluna * tX;
        let y = 0; // a ser atualizada
        let yI = y0 + posInicial.linha * tY;
        let yF = y0 + posFinal.linha * tY;
        let r = Math.sign(yF - yI) * tY / 2;
        let yC = (yI + yF) / 2;
        for (let tt = 1; tt < T; tt++) {
            y = yC + r * Math.cos((1 - tt / T) * Math.PI);
            traj.incluir(new Coords(x, y));
        }
    } else {
        // é horizontal
        alfaM *= Math.sign(posFinal.coluna - posInicial.coluna);
        let x = 0;  // a ser atualizada
        let y = y0 + posInicial.linha * tY;
        let xI = x0 + posInicial.coluna * tX;
        let xF = x0 + posFinal.coluna * tX;
        let r = Math.sign(xF - xI) * tX / 2;
        let xC = (xI + xF) / 2;
        for (let tt = 1; tt < T; tt++) {
            x = xC + r * Math.cos((1 - tt / T) * Math.PI);
            traj.incluir(new Coords(x, y));
        }
    }
    // ajuste de proporções e ângulos de rotação
    let p = 0;
    for (let tt = 0; tt < T; tt++) {
        p = pM * Math.sin(Math.PI * tt / T) + 1;
        traj.incluirProp(p);
        alfa = 180 * alfaM * Math.sqrt(1 - Math.pow(2 * tt / T - 1, 2)) / Math.PI;
        traj.incluirAngulo(alfa);
    }
    return traj;
}

// animação RECOLHER PEÇAS
function recolherPecas() {
    let T = 30;
    let N = 1;
    let x = 0;
    let y = 0;
    let xC = 150;
    let yC = 185;
    let xl = 0;
    let yl = 0;
    let fat = 1;
    fatEscala = 1;
    let alfa = 0;
    let Am = 0;

    if (t == 0) {   // somente no instante inicial
        fat = 1;
        alfa = 0;
    } else {
        alfa = 2 * Math.PI * t / (N * T);
        fat = 1 - (1 - Am) * t / T;
        fatEscala = 1 - (1 - 0.5) * t / T;
    }

    tela.cls();

    if (t <= T) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                peca = jogo.matriz[i][j];
                x = x0 + j * tX;
                y = y0 + i * tY;
                xl = xC + (x - xC) * fat * Math.cos(alfa) - (y - yC) * fat * Math.sin(alfa);
                yl = yC + (x - xC) * fat * Math.sin(alfa) + (y - yC) * fat * Math.cos(alfa);
                tela.exibirImgEsp('pc' + peca, xl, yl, escala * fatEscala, 0, 100 * (1 - t / T));
            }
        }
    }

    transportaPecas();

    // t++;
    // if (t >= T + 1) {
    //     t = 0;
    //     // animacaoSelecionada = ANIMACAO.ESPALHA;

    //     animacaoSelecionada = ANIMACAO.TRANSPORTA;
    //     // animacaoSelecionada = ANIMACAO.NADA;
    //     // embaralhando = true;
    //     // emAnimacao = false;
    // }

}

// animação ESPALHAR PEÇAS
function espalhaPecas() {
    let T = 20;
    let N = 1;
    let x = 0;
    let y = 0;
    let xC = 150;
    let yC = 185;
    let xl = 0;
    let yl = 0;
    let fat = 1;
    fatEscala = 0.7;
    let alfa = 0;
    let Am = 0.7;

    if (t == 0) {   // somente no instante inicial
        fat = 0;
        alfa = 0;
    } else {
        alfa = 2 * Math.PI * t / (N * T);
        fat = t / T;
        fatEscala = Am * t / T + 0.3;
    }

    tela.cls();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            peca = jogo.matriz[i][j];
            x = x0 + j * tX;
            y = y0 + i * tY;
            xl = xC + (x - xC) * fat * Math.cos(alfa) - (y - yC) * fat * Math.sin(alfa);
            yl = yC + (x - xC) * fat * Math.sin(alfa) + (y - yC) * fat * Math.cos(alfa);
            tela.exibirImgEsp('pc' + peca, xl, yl, escala * fatEscala, 0, 100 * (t / T));
        }
    }

    t++;
    if (t >= T + 1) {
        t = 0;
        animacaoSelecionada = ANIMACAO.NADA;
        embaralhando = true;
        emAnimacao = false;
    }
}

// animação de transporte de um canvas a outro
function transportaPecas() {

    if (t == 0) {   // somente no instante inicial
        canvasMaior.hidden = false;
        traj = getTrajTransportadas();
    }

    // exibindo movimento
    telaSuper.cls();
    let x = 0; // a ser modificado
    let y = 0; // a ser modificado
    let alfa = 0; // a ser modificado
    let e = 0; // a ser modificado
    let e0 = 0.2;
    for (let peca = 0; peca < 15; peca++) {
        x = traj[peca].pontos[t].x;
        y = traj[peca].pontos[t].y;
        alfa = traj[peca].angulos[t];
        e = e0 + (1 - e0) / 30 * t/2;
        telaSuper.exibirImgEsp('pc' + (peca + 1), x, y, 30 * e, alfa, 100);
    }

    // telaSuper.defCor('black');
    // telaSuper.pintaCirculo(new Coords(coordsJogo.x + 0, coordsJogo.y + 0), 1);

    if (t == traj[0].numQuadros - 1) {
        emAnimacao = false;
        t = 0;
        animacaoSelecionada = ANIMACAO.NADA;
        embaralhando = true;
        emAnimacao = false;
    } else {
        t++;
    }

}

// cria trajetórias das peças transportadas
function getTrajTransportadas() {
    let trajetorias = [];
    let traj = new Trajetoria();
    calculaCoordsJogo();
    calculaCoordsMini();
    const xC = coordsMini.x + 60 - 8;
    const yC = coordsMini.y + 60 - 97;
    const xJ = coordsJogo.x - 8;
    const yJ = coordsJogo.y - 97;
    const N = 50; // tempo da animação (segundos) / 60
    let xD = 0; // a ser definido para cada peça
    let yD = 0; // a ser definido para cada peça
    let xn = 0; // a ser definido para cada peça
    let yn = 0; // a ser definido para cada peça
    let alfa = 0;   // a ser definido para cada peça
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (i != 3 || j != 3) {
                xD = xJ + x0 + j * tX;
                yD = yJ + y0 + i * tY;
                traj = new Trajetoria;
                for (let n = 0; n <= N; n++) {
                    xn = xC + n / N * (xD - xC);
                    yn = yC + n / N * (yD - yC);
                    alfa = 90 * (1 - n / N);
                    traj.incluir(new Coords(xn, yn));
                    traj.incluirAngulo(alfa);
                }
                trajetorias.push(traj);
            }
        }
    }

    return trajetorias;
}




// ============  INSTRUÇÕES INICIAIS

// canvas superior (sobrepõe todos os painéis)
const containerMaior = document.getElementById('container-marior');
const canvasMaior = document.getElementById('canvas-maior');
canvasMaior.width = containerMaior.clientWidth;
canvasMaior.height = 450;
canvasMaior.hidden = true;

// objeto Tela:
var tela = new Tela('canvas');
var telaSuper = new Tela('canvas-maior');
var telaMini = new Tela('canvas-mini');

var t = 0;  // para controle das animações (tempo em unidade de quadro)

var jogo = new PainelJogo();
var cliqueAtivado = true;
var ultimaClicada = -1; // -1 = nenhuma clicada ainda

var x0 = 54;
var y0 = 60;
var tX = 65;
var tY = 83;
var escala = 30;

// NIVEL: 0 = neném, 1 = médio, 3 = insano
const NIVEL = {
    NENEM: 0,
    MEDIO: 1,
    INSANO: 2
}
var nivel = NIVEL.MEDIO;

// VEL: 0 = lesma, 1 = normal, 2 = da luz
const VEL = {
    LESMA: 0,
    NORMAL: 1,
    DA_LUZ: 2
}
var vel = VEL.LESMA;

// AUX: 0 = nenhum, 1 = retângulo, 2 = círculo
const AUX = {
    NENHUM: 0,
    RETANGULO: 1,
    CIRCULO: 2
}
var aux = AUX.NENHUM;

// indica se o jogo já iniciou
var emJogo = false;

// indica qual animação está em curso (inclusive nenhuma)
const ANIMACAO = {
    NADA: 0,
    MOVE_LESMA: 1,
    MOVE_NORMAL: 2,
    PAUSA: 3,    // apenas para limitar processamento rápido
    RECOLHE: 4,  // entes de embaralhar as peças
    ESPALHA: 5,
    TRANSPORTA: 6
}
var animacaoSelecionada = ANIMACAO.NADA;

// indica se está animando no momento
var emAnimacao = false;

// quanto ao embaralhamento inicial
var embaralhando = false;
var numeroLances = 0;
var lanceAtual = 0;

// calcula coordenadas relativas para transformação entre os canvas
// coordenadas do canvas do jogo
function calculaCoordsJogo() {
    const retMaior = document.getElementById('canvas-maior').getBoundingClientRect();
    const retJogo = document.getElementById('canvas').getBoundingClientRect();
    const xRel = retJogo.left - retMaior.left;
    const yRel = retJogo.top - retMaior.top;
    return new Coords(xRel, yRel);
}
function calculaCoordsMini() {
    const retMaior = document.getElementById('canvas-maior').getBoundingClientRect();
    const retMini = document.getElementById('canvas-mini').getBoundingClientRect();
    const xRel = retMini.left - retMaior.left;
    const yRel = retMini.top - retMaior.top;
    return new Coords(xRel, yRel);
}

// pequeno canvas no painel direito
// const telaMini = new Tela('canvas-mini');
telaMini.cls();
telaMini.defCor('lightgray');
telaMini.pintaCirculo(new Coords(60, 60), 60);



// coordenadas relativas dos canvas
var coordsJogo = calculaCoordsJogo();
var coordsMini = calculaCoordsMini();

// TESTANDO OS CANVAS
telaSuper.defCor('black');
telaSuper.pintaCirculo(new Coords(coordsJogo.x + 60, coordsJogo.y + 60), 60);
// telaSuper.defCor('red');
// telaSuper.pintaCirculo(new Coords(coordsJogo.x + 60, coordsJogo.y + 60), 50);
// telaSuper.pintaCirculo(new Coords(400, 200), 150)
// telaSuper.cls();



// ================ INICIAR TUDO =====================
iniciar();

function meuCodigo() {

    iniciaTemporizador(30, true);
    defineEventoClique();

    selecionaNivel(NIVEL.NENEM);

    telaMini.exibirImgEsp('pc1', 60, 60, 30, 0, 100);



}

// interação com o painel de controle ===

function selecionaNivel(n) {
    switch (n) {
        case NIVEL.NENEM:
            nivel = n;
            document.getElementById('btn-nivel').textContent = 'NENÉM';
            selecionaVel(VEL.LESMA);
            selecionaAux(AUX.NENHUM);
            break;
        case NIVEL.MEDIO:
            nivel = n;
            document.getElementById('btn-nivel').textContent = 'MÉDIO';
            selecionaVel(VEL.NORMAL);
            selecionaAux(AUX.NENHUM);
            break;
        case NIVEL.INSANO:
            nivel = n;
            document.getElementById('btn-nivel').textContent = 'INSANO';
            selecionaVel(VEL.DA_LUZ);
            selecionaAux(AUX.NENHUM);
            break;
    }
}

function selecionaAux(a) {
    switch (a) {
        case AUX.NENHUM:
            aux = a;
            document.getElementById('btn-aux').textContent = 'NADA';
            break;
        case AUX.RETANGULO:
            aux = a;
            document.getElementById('btn-aux').textContent = 'RETÂNGULO';
            break;
        case AUX.CIRCULO:
            aux = a;
            document.getElementById('btn-aux').textContent = 'CÍRCULO';
            break;
    }
}

function selecionaVel(v) {
    switch (v) {
        case VEL.LESMA:
            vel = v;
            document.getElementById('btn-vel').textContent = 'LESMA';
            break;
        case VEL.NORMAL:
            vel = v;
            document.getElementById('btn-vel').textContent = 'NORMAL';
            break;
        case VEL.DA_LUZ:
            vel = v;
            document.getElementById('btn-vel').textContent = 'DA LUZ';
            break;
    }
}

function btnIniciar() {
    jogo.iniciaMatriz();
    emJogo = false;
    if (embaralhando || emAnimacao) return;

    switch (nivel) {
        case NIVEL.NENEM:
            numeroLances = 10;
            break;
        case NIVEL.MEDIO:
            numeroLances = 30;
            break;
        case NIVEL.INSANO:
            numeroLances = 200;
            break;
    }

    // PROVISÓRIO: PRECISA SER REVISTO
    animacaoSelecionada = ANIMACAO.RECOLHE;
    emAnimacao = true;



}

function gestaoDeEmbaralhamento() {
    if (!embaralhando || emAnimacao) return;

    // escolhendo um movimento aleatório
    lanceAtual++;
    let opcoes = jogo.retornaPecasMoveis();
    let indiceEscolha = 0;
    let matriz = jogo.matriz;
    if (ultimaClicada == -1) {
        indiceEscolha = Math.floor(Math.random() * opcoes.length);
        ultimaClicada = matriz[opcoes[indiceEscolha].linha][opcoes[indiceEscolha].coluna];
    } else {
        let achou = false;
        let escLin = 0; // a ser alterado
        let escCol = 0; // a ser alterado
        let numPeca = 0; // a ser alterado
        while (!achou) {
            indiceEscolha = Math.floor(Math.random() * opcoes.length);
            escLin = opcoes[indiceEscolha].linha;
            escCol = opcoes[indiceEscolha].coluna;
            numPeca = matriz[escLin][escCol];
            if (ultimaClicada != numPeca) {
                jogo.clicarPeca(escLin, escCol);
                ultimaClicada = numPeca;
                achou = true;
            }
        }
    }
    if (lanceAtual == numeroLances) {
        emJogo = true;
        embaralhando = false;
        lanceAtual = 0;
    }


}
