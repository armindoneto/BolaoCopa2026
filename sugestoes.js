const FORM_URL =
"https://docs.google.com/forms/d/e/SEU_FORM_ID/formResponse";

const form = document.getElementById("formSugestao");

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const dados = new FormData();

    dados.append(
        "entry.1542607977",
        document.getElementById("nome").value
    );

    dados.append(
        "entry.1568270947",
        document.getElementById("sugestao").value
    );

    await fetch(FORM_URL,{
        method:"POST",
        mode:"no-cors",
        body:dados
    });

    document.getElementById("mensagem").innerHTML=
        "✅ Obrigado pela sugestão!";

    form.reset();

});
