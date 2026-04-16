const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("OK GUIA APP");
});

app.get("/imovel/:codigo", (req, res) => {
  res.json({
    codigo: req.params.codigo,
    ok: true
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
