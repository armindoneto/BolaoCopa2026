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
  "Bósnia e Herzegovina": "ba",
  "Cabo Verde": "cv",
  "Gana": "gh",
  "Curaçao": "cw",
  "Haiti": "ht",
  "Nova Zelândia": "nz"
};

let dados = [];

Papa.parse(CSV_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(resultado) {
    dados = resultado.data;
    desenharTabela(dados);
  }
});

function normalizar(texto) {
  return String(texto || "").trim();
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
  span.appendChild(texto);

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
    th.textContent = coluna;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  linhas.forEach(linha => {
    const tr = document.createElement("tr");

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

document.querySelector("#busca").addEventListener("input", function(e) {
  const termo = e.target.value.toLowerCase();

  const filtrados = dados.filter(linha =>
    Object.values(linha).some(valor =>
      String(valor).toLowerCase().includes(termo)
    )
  );

  desenharTabela(filtrados);
});
