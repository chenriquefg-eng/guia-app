const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

function nl2br(texto) {
  if (!texto) return "";
  return String(texto).replace(/\n/g, "<br>");
}

app.get("/", (req, res) => {
  res.send("Guia do Hóspede rodando 🚀");
});

app.get("/imovel/:codigo", async (req, res) => {
  const { codigo } = req.params;

  try {
    const imovelResult = await pool.query(
      "SELECT * FROM imoveis WHERE codigo_publico = $1",
      [codigo]
    );

    if (imovelResult.rows.length === 0) {
      return res.status(404).send("Imóvel não encontrado");
    }

    const imovel = imovelResult.rows[0];

    const conteudoResult = await pool.query(
      "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 LIMIT 1",
      [imovel.id]
    );

    const conteudo = conteudoResult.rows[0] || {};

    // LINKS DINÂMICOS
    const endereco = encodeURIComponent(
      conteudo.endereco_exibicao ||
      `${imovel.endereco}, ${imovel.cidade}`
    );

    const linkMaps = `https://www.google.com/maps/search/?api=1&query=${endereco}`;
    const linkUber = `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${endereco}`;
    const telefone = "5522998337912";
    const linkWhatsApp = `https://wa.me/${telefone}?text=Olá, estou no apartamento e preciso de ajuda`;

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${conteudo.titulo || "Guia do Hóspede"}</title>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial;
  background: #f2f4f7;
  color: #1f2937;
}

.container {
  max-width: 850px;
  margin: auto;
  padding: 20px;
}

.card {
  background: #ffffff;
  padding: 22px;
  border-radius: 16px;
  margin-bottom: 18px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}

.hero {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  padding: 30px;
  border-radius: 18px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 32px;
}

h2 {
  margin-bottom: 10px;
}

p {
  margin: 6px 0;
}

.wifi-box {
  background: #eef2ff;
  padding: 16px;
  border-radius: 12px;
}

.wifi {
  font-weight: bold;
}

.botao {
  display: block;
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border-radius: 12px;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  color: white;
}

.maps { background: #10b981; }
.uber { background: #000000; }
.whatsapp { background: #25d366; }

@media (max-width: 600px) {
  h1 {
    font-size: 24px;
  }

  .container {
    padding: 12px;
  }
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
  z-index: 999;
}

.toast.show {
  opacity: 1;
  bottom: 30px;
}

</style>

</head>

<body>

<div class="container">

<div class="hero">
  <h1>${conteudo.titulo}</h1>
  <p>${conteudo.subtitulo}</p>
  <p>${conteudo.endereco_exibicao}</p>
</div>

<div class="card">
  <h2>${conteudo.boas_vindas_titulo}</h2>
  <p>${conteudo.boas_vindas_subtitulo}</p>
</div>

<div class="card">
  <h2>📶 Wi-Fi</h2>
  <div class="wifi-box">
    <p><strong>Rede:</strong> ${conteudo.wifi_nome}</p>
<button class="botao maps" onclick="copiarTexto('${conteudo.wifi_nome}')">
  📋 Copiar Rede
</button>

<p><strong>Senha:</strong> ${conteudo.wifi_senha}</p>
<button class="botao uber" onclick="copiarTexto('${conteudo.wifi_senha}')">
  📋 Copiar Senha
</button>
  </div>
</div>

<div class="card">
  <h2>🚀 Acesso rápido</h2>

  <a class="botao maps" href="${linkMaps}" target="_blank">
    📍 Abrir no Google Maps
  </a>

  <a class="botao uber" href="${linkUber}" target="_blank">
    🚕 Chamar Uber
  </a>

  <a class="botao whatsapp" href="${linkWhatsApp}" target="_blank">
    📞 Falar no WhatsApp
  </a>
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
  <h2>🏠 Apartamento</h2>
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
<script>
function copiarTexto(texto) {
  navigator.clipboard.writeText(texto).then(() => {
    const aviso = document.createElement("div");
    aviso.innerText = "Copiado!";
    aviso.style.position = "fixed";
    aviso.style.bottom = "20px";
    aviso.style.left = "50%";
    aviso.style.transform = "translateX(-50%)";
    aviso.style.background = "#111";
    aviso.style.color = "#fff";
    aviso.style.padding = "10px 20px";
    aviso.style.borderRadius = "8px";

    document.body.appendChild(aviso);

    setTimeout(() => {
      aviso.remove();
    }, 2000);
  });
}
</script>
<div id="toast" class="toast">Copiado!</div>

</body>
</html>
    `;

    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.listen(port, () => {
  console.log("Servidor rodando 🚀");
});
