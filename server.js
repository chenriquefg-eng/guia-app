const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${conteudo.titulo || "Guia do Hóspede"}</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f6f1ea;
      color: #2f241f;
      line-height: 1.5;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }

    .hero {
      background: linear-gradient(180deg, #7d6b5d 0%, #5d4b3f 100%);
      color: #fff;
      border-radius: 24px;
      padding: 40px 24px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    }

    .hero h1 {
      margin: 0 0 10px;
      font-size: 38px;
    }

    .hero h2 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 600;
    }

    .hero p {
      margin: 6px 0;
      font-size: 16px;
      opacity: 0.95;
    }

    .section {
      background: #fff;
      border-radius: 20px;
      padding: 24px;
      margin-top: 20px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    }

    .section h3 {
      margin-top: 0;
      margin-bottom: 14px;
      font-size: 22px;
      color: #4f3e33;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .info-box {
      background: #f8f4ef;
      border-radius: 16px;
      padding: 16px;
    }

    .info-label {
      font-size: 13px;
      color: #7b6b60;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 18px;
      font-weight: bold;
      color: #2f241f;
      word-break: break-word;
    }

    .texto {
      font-size: 16px;
      color: #3f342d;
    }

    .footer {
      text-align: center;
      margin-top: 28px;
      color: #7b6b60;
      font-size: 14px;
    }

    @media (max-width: 700px) {
      .hero h1 {
        font-size: 30px;
      }

      .hero h2 {
        font-size: 20px;
      }

      .grid-2 {
        grid-template-columns: 1fr;
      }

      .container {
        padding: 16px 12px 32px;
      }
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="hero">
      <h1>${conteudo.titulo || "GUIA DO HÓSPEDE"}</h1>
      <h2>${conteudo.subtitulo || imovel.nome || ""}</h2>
      <p>${conteudo.endereco_exibicao || `${imovel.endereco}, ${imovel.apartamento} - ${imovel.cidade}/${imovel.estado}`}</p>
    </div>

    <div class="section">
      <h3>${conteudo.boas_vindas_titulo || "Seja bem-vindo!"}</h3>
      <div class="texto">${nl2br(conteudo.boas_vindas_subtitulo || "")}</div>
    </div>

    <div class="section">
      <h3>Wi-Fi</h3>
      <div class="grid-2">
        <div class="info-box">
          <div class="info-label">Rede</div>
          <div class="info-value">${conteudo.wifi_nome || "Não informado"}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Senha</div>
          <div class="info-value">${conteudo.wifi_senha || "Não informada"}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Check-in / Check-out</h3>
      <div class="grid-2">
        <div class="info-box">
          <div class="info-label">Check-in</div>
          <div class="texto">${nl2br(conteudo.checkin_texto || "Não informado")}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Check-out</div>
          <div class="texto">${nl2br(conteudo.checkout_texto || "Não informado")}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>O apartamento</h3>
      <div class="texto">${nl2br(conteudo.apartamento_texto || "Informações não disponíveis.")}</div>
    </div>

    <div class="section">
      <h3>Como chegar</h3>
      <div class="texto">${nl2br(conteudo.como_chegar_texto || "Informações não disponíveis.")}</div>
    </div>

    <div class="section">
      <h3>Como se locomover</h3>
      <div class="texto">${nl2br(conteudo.transporte_texto || "Informações não disponíveis.")}</div>
    </div>

    <div class="section">
      <h3>Regras do apartamento</h3>
      <div class="texto">${nl2br(conteudo.regras_texto || "Informações não disponíveis.")}</div>
    </div>

    <div class="section">
      <h3>Antes de partir</h3>
      <div class="texto">${nl2br(conteudo.antes_partir_texto || "Informações não disponíveis.")}</div>
    </div>

    <div class="section">
      <h3>Contato</h3>
      <div class="texto">${nl2br(conteudo.contato_texto || "Informações não disponíveis.")}</div>
    </div>

    <div class="footer">
      Código do imóvel: ${imovel.codigo_publico}
    </div>

  </div>
</body>
</html>
    `;

    return res.send(html);
  } catch (err) {
    console.error("Erro geral:", err.message);
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(\`Servidor rodando na porta \${port}\`);
});
