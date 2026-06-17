const CSV_EQUIPES_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQE2-mfvvTNWXF7dpzLmoTkTHryMo0TSxlpFX9kcXiYGyZFGzaXmIs23lJ8NyU8HEXseWYsndO9cD6w/pub?gid=824033652&single=true&output=csv";

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

    if (!time || !texto) return;

    if (!grupos[time]) {
      grupos[time] = [];
    }

    grupos[time].push(texto);
  });

  Object.entries(grupos).forEach(([time, textos]) => {
    const bloco = document.createElement("div");
    bloco.className = "bloco-equipe";

    const titulo = document.createElement("h2");
    titulo.textContent = time;

    const lista = document.createElement("ul");

    textos.forEach(texto => {
      const item = document.createElement("li");
      item.textContent = texto;
      lista.appendChild(item);
    });

    bloco.appendChild(titulo);
    bloco.appendChild(lista);

    area.appendChild(bloco);
  });
}
