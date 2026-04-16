const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

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

    const conteudo = conteudoResult.rows[0] || null;

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
<title>${conteudo.titulo}</title>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
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

h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

h2 {
  margin-bottom: 10px;
  font-size: 20px;
}

p {
  margin: 6px 0;
  line-height: 1.5;
}

.hero {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  padding: 30px;
  border-radius: 18px;
  margin-bottom: 20px;
}

.hero h1 {
  color: white;
}

.hero p {
  opacity: 0.9;
}

.wifi-box {
  background: #eef2ff;
  padding: 16px;
  border-radius: 12px;
}

.wifi {
  font-size: 18px;
  font-weight: bold;
}

.section-icon {
  margin-right: 8px;
}

@media (max-width: 600px) {
  h1 {
    font-size: 24px;
  }

  .container {
    padding: 12px;
  }
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
</style></head>

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
    <p class="wifi">Rede: ${conteudo.wifi_nome}</p>
    <p class="wifi">Senha: ${conteudo.wifi_senha}</p>
  </div>
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

</body>
</html>
`;

return res.send(html);
  } catch (err) {
    console.error("ERRO GERAL:", err.message);
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
