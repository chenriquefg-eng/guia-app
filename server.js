const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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
      return res.send("Imóvel não encontrado");
    }

    const imovel = imovelResult.rows[0];

    let conteudo = null;

    try {
      const conteudoResult = await pool.query(
        "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 LIMIT 1",
        [imovel.id]
      );

      conteudo = conteudoResult.rows[0] || null;

    } catch (erroConteudo) {
      console.error("Erro conteudo:", erroConteudo.message);
    }

    return res.json({
      imovel,
      conteudo
    });

  } catch (err) {
    console.error("Erro geral:", err.message);
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
