const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("OK GUIA APP 🚀");
});

app.get("/imovel/:codigo", (req, res) => {
  res.send("ROTA OK 🚀");
});

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
