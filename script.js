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
desenharDestaques();
desenharTabela(dados);
criarCachePesquisa();
  }
});

function normalizar(texto) {
  return String(texto || "").trim();
}

function desenharDestaques() {
  const area = document.querySelector("#destaques");
  if (!area || !dados.length) return;

  area.innerHTML = "";

  const destaques = [
    { titulo: "🥇 1º Lugar", linha: dados[0], classe: "ouro" },
    { titulo: "🥈 2º Lugar", linha: dados[1], classe: "prata" },
    { titulo: "🥉 3º Lugar", linha: dados[2], classe: "bronze" },
    { titulo: "🏅 4º Lugar", linha: dados[3], classe: "quarto" },
    { titulo: "🔻 Lanterna", linha: dados[dados.length - 1], classe: "lanterna" }
  ];

  destaques.forEach(item => {
    const card = document.createElement("div");
    card.className = `card-destaque ${item.classe}`;

    const nome = item.linha["PARTICIPANTE"] || item.linha["Participante"] || "";
    const pontos = item.linha["P"] || item.linha["PONTOS"] || item.linha["Pontos"] || "";

    const titulo = document.createElement("div");
    titulo.className = "card-titulo";
    titulo.textContent = item.titulo;

    const participante = document.createElement("div");
    participante.className = "card-nome";
    participante.textContent = nome;

    const pontuacao = document.createElement("div");
    pontuacao.className = "card-pontos";
    pontuacao.textContent = `${pontos} pts`;

    const bandeirasCard = document.createElement("div");
    bandeirasCard.className = "card-bandeiras";

    Object.values(item.linha).forEach(valor => {
      const pais = normalizar(valor);

      if (bandeiras[pais]) {
        bandeirasCard.appendChild(criarPais(pais));
      }
    });

    card.appendChild(titulo);
    card.appendChild(participante);
    card.appendChild(pontuacao);
    card.appendChild(bandeirasCard);

    area.appendChild(card);
  });
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

  const trHead = document.createElement("tr");
  colunas.forEach(coluna => {
  const th = document.createElement("th");

  // Remove sufixos criados automaticamente quando há cabeçalhos repetidos
  // Exemplo: N1_1 vira N1, N2_2 vira N2
  th.textContent = coluna.replace(/_\d+$/, "");

  trHead.appendChild(th);
});
  thead.appendChild(trHead);

linhas.forEach(linha => {
  const tr = document.createElement("tr");

  const posicaoOriginal = dados.indexOf(linha);

  if (posicaoOriginal === 0) tr.classList.add("top1");
  if (posicaoOriginal === 1) tr.classList.add("top2");
  if (posicaoOriginal === 2) tr.classList.add("top3");
  if (posicaoOriginal === 3) tr.classList.add("top4");
  if (posicaoOriginal === dados.length - 1) tr.classList.add("ultimo");

    colunas.forEach(coluna => {
      const td = document.createElement("td");
      preencherCelula(td, linha[coluna]);

      const nomeColuna = coluna.toLowerCase();

      if (nomeColuna.includes("pos") || nomeColuna === "c") {
        td.classList.add("posicao");
      }

      if (nomeColuna.includes("ponto") || nomeColuna === "p") {
        td.classList.add("pontos");
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
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
      const linha = linhas[item.indice];

      if (!linha) return;

      if (item.texto.includes(termo)) {
        linha.classList.add("destacada");
      } else {
        linha.classList.add("apagada");
      }
    });
  }, 150);
});
