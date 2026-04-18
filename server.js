const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

app.get("/", (req, res) => {
  res.send("OK GUIA APP");
});

app.get("/imovel/:codigo/:idioma?", async (req, res) => {
  const { codigo } = req.params;
  const idioma = req.params.idioma || "pt";

  try {
    const imovelResult = await pool.query(
      "SELECT * FROM imoveis WHERE codigo_publico = $1",
      [codigo]
    );

    if (imovelResult.rows.length === 0) {
      return res.status(404).send("Imóvel não encontrado");
    }

    const imovel = imovelResult.rows[0];

    let conteudoResult = await pool.query(
      "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = $2 LIMIT 1",
      [imovel.id, idioma]
    );

    if (conteudoResult.rows.length === 0 && idioma !== "pt") {
      conteudoResult = await pool.query(
        "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = 'pt' LIMIT 1",
        [imovel.id]
      );
    }

    return res.json({
  imovel,
  conteudo: conteudoResult.rows[0] || null
});
  } catch (err) {
    console.error("ERRO:", err);
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log("Servidor rodando 🚀");
});
