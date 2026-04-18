const conteudo = conteudoResult.rows[0] || {};

function nl2br(texto) {
  if (!texto) return "";
  return String(texto).replace(/\n/g, "<br>");
}

const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${conteudo.titulo || "Guia"}</title>

<style>
body {
  margin: 0;
  font-family: Arial;
  background: #f2f4f7;
}

.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 16px;
}

.hero {
  background: linear-gradient(135deg,#6366f1,#4f46e5);
  color: white;
}

.botao {
  display: block;
  padding: 14px;
  border-radius: 10px;
  margin-top: 10px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  color: white;
}

.maps { background: #10b981; }
.uber { background: black; }
.whatsapp { background: #25d366; }

.selecionado {
  box-shadow: 0 0 0 3px #6366f1;
}
</style>

</head>
<body>

<div class="container">

<div class="card hero">
<h1>${conteudo.titulo}</h1>
<p>${conteudo.subtitulo}</p>
<p>${conteudo.endereco_exibicao}</p>
</div>

<div class="card">
<h2>🌍 Idioma</h2>

<a class="botao maps ${idioma === "pt" ? "selecionado" : ""}" href="/imovel/${codigo}/pt">🇧🇷 Português</a>
<a class="botao uber ${idioma === "en" ? "selecionado" : ""}" href="/imovel/${codigo}/en">🇺🇸 English</a>
<a class="botao whatsapp ${idioma === "es" ? "selecionado" : ""}" href="/imovel/${codigo}/es">🇪🇸 Español</a>

</div>

<div class="card">
<h2>${conteudo.boas_vindas_titulo}</h2>
<p>${conteudo.boas_vindas_subtitulo}</p>
</div>

<div class="card">
<h2>📶 Wi-Fi</h2>
<p><b>Rede:</b> ${conteudo.wifi_nome}</p>
<p><b>Senha:</b> ${conteudo.wifi_senha}</p>
</div>

<div class="card">
<h2>🔑 Check-in</h2>
<p>${nl2br(conteudo.checkin_texto)}</p>
</div>

<div class="card">
<h2>🚪 Check-out</h2>
<p>${nl2br(conteudo.checkout_texto)}</p>
</div>

<div class="card">
<h2>📜 Regras</h2>
<p>${nl2br(conteudo.regras_texto)}</p>
</div>

<div class="card">
<h2>📍 Como chegar</h2>
<p>${nl2br(conteudo.como_chegar_texto)}</p>
</div>

</div>

</body>
</html>
`;

return res.send(html);
