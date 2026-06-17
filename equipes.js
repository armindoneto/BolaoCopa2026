const CSV_EQUIPES_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQE2-mfvvTNWXF7dpzLmoTkTHryMo0TSxlpFX9kcXiYGyZFGzaXmIs23lJ8NyU8HEXseWYsndO9cD6w/pub?gid=824033652&single=true&output=csv";

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

let dadosEquipes = [];

Papa.parse(CSV_EQUIPES_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(resultado) {
    dadosEquipes = resultado.data;
    desenharListaEquipes(dadosEquipes);
  }
});

function desenharListaEquipes(linhas) {
  const area = document.querySelector("#lista-equipes");
  area.innerHTML = "";

  if (!linhas.length) return;

  const colunas = Object.keys(linhas[0]);
  const colunaTime = colunas[0];
  const colunaTexto = colunas[1];

  const grupos = {};

linhas.forEach(linha => {

    const time = String(linha[colunaTime] || "").trim();
    const texto = String(linha[colunaTexto] || "").trim();

    if (!time) return;

    if (!grupos[time]) {
        grupos[time] = [];
    }

    if (texto !== "") {
        grupos[time].push(texto);
    }

});

  Object.entries(grupos).forEach(([time, textos]) => {
    const bloco = document.createElement("div");
    bloco.className = "bloco-equipe";

const titulo = document.createElement("h2");

const codigo = bandeiras[time];

if (codigo) {
  const img = document.createElement("img");
  img.src = `https://flagcdn.com/w40/${codigo}.png`;
  img.alt = time;
  img.className = "bandeira-equipe";

  titulo.appendChild(img);
}

titulo.appendChild(document.createTextNode(time));

    const lista = document.createElement("ul");

if (textos.length === 0) {

    const item = document.createElement("li");
    item.textContent = "Nenhuma pontuação obtida";
    item.className = "sem-pontos";
    lista.appendChild(item);

} else {

    textos.forEach(texto => {
        const item = document.createElement("li");
        item.textContent = texto;
        lista.appendChild(item);
    });

}

    bloco.appendChild(titulo);
    bloco.appendChild(lista);

    area.appendChild(bloco);
  });
}
