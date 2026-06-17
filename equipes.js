const CSV_EQUIPES_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQE2-mfvvTNWXF7dpzLmoTkTHryMo0TSxlpFX9kcXiYGyZFGzaXmIs23lJ8NyU8HEXseWYsndO9cD6w/pub?gid=824033652&single=true&output=csv";

let dadosEquipes = [];

Papa.parse(CSV_EQUIPES_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(resultado) {
    dadosEquipes = resultado.data;
    desenharTabelaEquipes(dadosEquipes);
  }
});

function desenharTabelaEquipes(linhas) {
  const thead = document.querySelector("#tabela-equipes thead");
  const tbody = document.querySelector("#tabela-equipes tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (!linhas.length) return;

  const colunas = Object.keys(linhas[0]);

  const trHead = document.createElement("tr");

  colunas.forEach(coluna => {
    const th = document.createElement("th");
    th.textContent = coluna.replace(/_\d+$/, "");
    trHead.appendChild(th);
  });

  thead.appendChild(trHead);

  linhas.forEach(linha => {
    const tr = document.createElement("tr");

    colunas.forEach(coluna => {
      const td = document.createElement("td");
      td.textContent = linha[coluna];
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}
