const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/", (req, res) => {
  res.send("Guia do Hóspede rodando v2 🚀");

app.get("/imovel/:codigo", (req, res) => {
  res.json({
    NOVO: "VERSAO_NOVA"
  });
});
  } catch (err) {
    console.error("Erro geral:", err.message);
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
