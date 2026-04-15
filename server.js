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
    const result = await pool.query(
      "SELECT * FROM imoveis WHERE codigo_publico = $1",
      [codigo]
    );

    if (result.rows.length === 0) {
      return res.send("Imóvel não encontrado");
    }

    const imovel = result.rows[0];

const conteudo = await pool.query(
  "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = 'pt'",
  [imovel.id]
);

res.json({
  ...imovel,
  conteudo: conteudo.rows[0] || null
});
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
