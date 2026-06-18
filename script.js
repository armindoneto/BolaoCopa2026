const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQE2-mfvvTNWXF7dpzLmoTkTHryMo0TSxlpFX9kcXiYGyZFGzaXmIs23lJ8NyU8HEXseWYsndO9cD6w/pub?gid=1198074937&single=true&output=csv";

const bandeiras = {
  "França": "fr",
  "Espanha": "es",
  "Argentina": "ar",
  "Inglaterra": "gb-eng",
  "Portugal": "pt",
  "Brasil": "br",
  "Holanda": "nl",
  "Marrocos": "ma",
  "Bélgica": "be",
  "Alemanha": "de",
  "Croácia": "hr",
  "Colômbia": "co",
  "Senegal": "sn",
  "México": "mx",
  "EUA": "us",
  "Estados Unidos": "us",
  "Uruguai": "uy",
  "Japão": "jp",
  "Suíça": "ch",
  "Irã": "ir",
  "Turquia": "tr",
  "Equador": "ec",
  "Áustria": "at",
  "Coreia do Sul": "kr",
  "Austrália": "au",
  "Argélia": "dz",
  "Egito": "eg",
  "Canadá": "ca",
  "Noruega": "no",
  "Panamá": "pa",
  "Costa do Marfim": "ci",
  "Suécia": "se",
  "Paraguai": "py",
  "Rep. Tcheca": "cz",
  "República Tcheca": "cz",
  "Escócia": "gb-sct",
  "Tunísia": "tn",
  "Congo": "cd",
  "Uzbequistão": "uz",
  "Catar": "qa",
  "Iraque": "iq",
  "África do Sul": "za",
  "Arábia Saudita": "sa",
  "Jordânia": "jo",
  "Bósnia": "ba",
  "Cabo Verde": "cv",
  "Gana": "gh",
  "Curaçao": "cw",
  "Haiti": "ht",
  "Nova Zelândia": "nz"
};

let dados = [];
let cachePesquisa = [];

Papa.parse(CSV_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(resultado) {
dados = resultado.data;
desenharTabela(dados);
criarCachePesquisa();
  }
});

function normalizar(texto) {
  return String(texto || "").trim();
}

function criarCachePesquisa() {
  cachePesquisa = dados.map((linha, indice) => ({
    indice,
    texto: Object.values(linha).join(" ").toLowerCase()
  }));
}

function criarPais(nome) {
  const pais = normalizar(nome);
  const codigo = bandeiras[pais];

  if (!codigo) return document.createTextNode(pais);

  const span = document.createElement("span");
  span.className = "pais";

  const img = document.createElement("img");
  img.src = `https://flagcdn.com/w40/${codigo}.png`;
  img.alt = pais;

  const texto = document.createElement("span");
  texto.textContent = pais;

  span.appendChild(img);

  return span;
}

function preencherCelula(td, valor) {
  const texto = normalizar(valor);

  if (!texto) {
    td.textContent = "";
    return;
  }

  if (bandeiras[texto]) {
    td.appendChild(criarPais(texto));
    return;
  }

  if (texto.includes(";")) {
    texto.split(";").forEach(item => {
      const pais = normalizar(item);
      if (pais) td.appendChild(criarPais(pais));
    });
    return;
  }

  td.textContent = texto;
}

function desenharTabela(linhas) {
  const thead = document.querySelector("#tabela thead");
  const tbody = document.querySelector("#tabela tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (!linhas.length) return;

  const colunas = Object.keys(linhas[0]);

  const colunasFixas = colunas.slice(0, 3);      // C, PARTICIPANTE, P
  const colunasPontos = colunas.slice(3, 14);    // N1 a N11
  const colunasBandeiras = colunas.slice(14);    // 16 seleções

  // Cabeçalho
  const trHead = document.createElement("tr");

  colunasFixas.forEach(coluna => {
    const th = document.createElement("th");
    th.textContent = coluna.replace(/_\d+$/, "");
    trHead.appendChild(th);
  });

  colunasPontos.forEach(coluna => {
    const th = document.createElement("th");
    th.textContent = coluna.replace(/_\d+$/, "");
    trHead.appendChild(th);
  });

  thead.appendChild(trHead);

  linhas.forEach((linha, indiceLinha) => {
    const trBandeiras = document.createElement("tr");
    const trPontos = document.createElement("tr");

    const posicaoOriginal = dados.indexOf(linha);

    trBandeiras.dataset.indice = posicaoOriginal;
trPontos.dataset.indice = posicaoOriginal;

    if (posicaoOriginal === 0) {
      trBandeiras.classList.add("top1");
      trPontos.classList.add("top1");
    }

    if (posicaoOriginal === 1) {
      trBandeiras.classList.add("top2");
      trPontos.classList.add("top2");
    }

    if (posicaoOriginal === 2) {
      trBandeiras.classList.add("top3");
      trPontos.classList.add("top3");
    }

    if (posicaoOriginal === 3) {
      trBandeiras.classList.add("top4");
      trPontos.classList.add("top4");
    }

    if (posicaoOriginal === dados.length - 1) {
      trBandeiras.classList.add("ultimo");
      trPontos.classList.add("ultimo");
    }

    // Colunas fixas: C, PARTICIPANTE, P
    colunasFixas.forEach(coluna => {
      const td = document.createElement("td");

      if (coluna === colunasFixas[0]) td.classList.add("fixa-c");
if (coluna === colunasFixas[1]) td.classList.add("fixa-participante");
      
      td.rowSpan = 2;

      preencherCelula(td, linha[coluna]);

      const nomeColuna = coluna.toLowerCase();

      if (nomeColuna.includes("pos") || nomeColuna === "c") {
        td.classList.add("posicao");
      }

      if (nomeColuna.includes("ponto") || nomeColuna === "p") {
        td.classList.add("pontos");
      }

      trBandeiras.appendChild(td);
    });

    // N1 a N11
    colunasPontos.forEach((colunaPonto, indiceNivel) => {
      const tdBandeiras = document.createElement("td");
      tdBandeiras.classList.add("celula-bandeiras");

      const tdPonto = document.createElement("td");
      tdPonto.classList.add("celula-ponto-nivel");

      const bandeirasDoNivel = obterBandeirasDoNivel(linha, colunasBandeiras, indiceNivel);

      bandeirasDoNivel.forEach(nomePais => {
        tdBandeiras.appendChild(criarPais(nomePais));
      });

      tdPonto.textContent = linha[colunaPonto];

      trBandeiras.appendChild(tdBandeiras);
      trPontos.appendChild(tdPonto);
    });

    tbody.appendChild(trBandeiras);
    tbody.appendChild(trPontos);
  });
}

function obterBandeirasDoNivel(linha, colunasBandeiras, indiceNivel) {
  // N1 a N6 têm 1 seleção
  if (indiceNivel <= 5) {
    const coluna = colunasBandeiras[indiceNivel];
    return coluna ? [normalizar(linha[coluna])] : [];
  }

  // N7 a N11 têm 2 seleções
  const indiceInicial = 6 + ((indiceNivel - 6) * 2);

  const coluna1 = colunasBandeiras[indiceInicial];
  const coluna2 = colunasBandeiras[indiceInicial + 1];

  const selecoes = [];

  if (coluna1) selecoes.push(normalizar(linha[coluna1]));
  if (coluna2) selecoes.push(normalizar(linha[coluna2]));

  return selecoes.filter(Boolean);
}

const busca = document.querySelector("#busca");

let timerBusca;

busca.addEventListener("input", function () {
  clearTimeout(timerBusca);

  timerBusca = setTimeout(() => {
    const termo = busca.value.toLowerCase();

    const linhas = document.querySelectorAll("#tabela tbody tr");

    linhas.forEach(linha => {
      linha.classList.remove("destacada", "apagada");
    });

    if (termo === "") return;

    cachePesquisa.forEach(item => {
      const linhasDoParticipante = document.querySelectorAll(
        `#tabela tbody tr[data-indice="${item.indice}"]`
      );

      linhasDoParticipante.forEach(linha => {
        if (item.texto.includes(termo)) {
          linha.classList.add("destacada");
        } else {
          linha.classList.add("apagada");
        }
      });
    });
  }, 150);
});
