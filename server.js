const conteudo = conteudoResult.rows[0] || {};

function nl2br(texto) {
  if (!texto) return "";
  return String(texto).replace(/\n/g, "<br>");
}

const endereco = encodeURIComponent(
  conteudo.endereco_exibicao || `${imovel.endereco}, ${imovel.cidade}`
);

const linkMaps = `https://www.google.com/maps/search/?api=1&query=${endereco}`;

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
  font-family: Arial, sans-serif;
  background: #f2f4f7;
  color: #1f2937;
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
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
}

.hero {
  background: linear-gradient(135deg,#6366f1,#4f46e5);
  color: white;
}

.hero h1 {
  margin-top: 0;
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
  border: none;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.maps { background: #10b981; }
.uber { background: #000; }
.whatsapp { background: #25d366; }

.selecionado {
  box-shadow: 0 0 0 3px #6366f1;
}

.wifi-box {
  background: #eef2ff;
  padding: 16px;
  border-radius: 12px;
}

.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 9999;
}

.toast.show {
  opacity: 1;
  bottom: 30px;
}

@media (max-width: 600px) {
  .container {
    padding: 12px;
  }

  h1 {
    font-size: 28px;
  }
}
</style>
</head>
<body>

<div class="container">

  <div class="card hero">
    <h1>${conteudo.titulo || ""}</h1>
    <p>${conteudo.subtitulo || ""}</p>
    <p>${conteudo.endereco_exibicao || ""}</p>
  </div>

  <div class="card">
    <h2>🌍 Idioma</h2>
    <a class="botao maps ${idioma === "pt" ? "selecionado" : ""}" href="/imovel/${codigo}/pt">🇧🇷 Português</a>
    <a class="botao uber ${idioma === "en" ? "selecionado" : ""}" href="/imovel/${codigo}/en">🇺🇸 English</a>
    <a class="botao whatsapp ${idioma === "es" ? "selecionado" : ""}" href="/imovel/${codigo}/es">🇪🇸 Español</a>
  </div>

  <div class="card">
    <h2>${conteudo.boas_vindas_titulo || "Boas-vindas"}</h2>
    <p>${conteudo.boas_vindas_subtitulo || ""}</p>
  </div>

  <div class="card">
    <h2>📶 Wi-Fi</h2>
    <div class="wifi-box">
      <p><strong>Rede:</strong> ${conteudo.wifi_nome || ""}</p>
      <button class="botao maps" onclick="copiarTexto('${conteudo.wifi_nome || ""}')">📋 Copiar Rede</button>

      <p style="margin-top:12px;"><strong>Senha:</strong> ${conteudo.wifi_senha || ""}</p>
      <button class="botao uber" onclick="copiarTexto('${conteudo.wifi_senha || ""}')">🔐 Copiar Senha</button>
    </div>
  </div>

  <div class="card">
    <h2>📍 Localização</h2>
    <a class="botao maps" href="${linkMaps}" target="_blank">Abrir no Google Maps</a>
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
    <h2>🏠 O apartamento</h2>
    <p>${nl2br(conteudo.apartamento_texto)}</p>
  </div>

  <div class="card">
    <h2>📍 Como chegar</h2>
    <p>${nl2br(conteudo.como_chegar_texto)}</p>
  </div>

  <div class="card">
    <h2>🚗 Transporte</h2>
    <p>${nl2br(conteudo.transporte_texto)}</p>
  </div>

  <div class="card">
    <h2>🧳 Antes de sair</h2>
    <p>${nl2br(conteudo.antes_partir_texto)}</p>
  </div>

  <div class="card">
    <h2>📞 Contato</h2>
    <p>${nl2br(conteudo.contato_texto)}</p>
  </div>

</div>

<div id="toast" class="toast">Copiado!</div>

<script>
function copiarTexto(texto) {
  navigator.clipboard.writeText(texto);
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}
</script>

</body>
</html>
`;

return res.send(html);
