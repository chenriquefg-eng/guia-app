const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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
      console.error("ERRO NA TABELA imovel_conteudos:", erroConteudo.message);
    }

    return res.json({
      imovel,
      conteudo
    });

  } catch (err) {
    console.error("ERRO GERAL:", err);
    return res.status(500).send(err.message);
  }
});
  } catch (err) {
  console.error("ERRO DETALHADO:", err);
  res.status(500).send(err.message);
}
  try {
    const imovelResult = await pool.query(
      "SELECT * FROM imoveis WHERE codigo_publico = $1",
      [codigo]
    );

    if (imovelResult.rows.length === 0) {
      return res.send("Imóvel não encontrado");
    }

    const imovel = imovelResult.rows[0];

    let conteudoResult = await pool.query(
      "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 LIMIT 1",
      [imovel.id, idioma]
    );

    if (conteudoResult.rows.length === 0 && idioma !== "pt") {
      conteudoResult = await pool.query(
        "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = 'pt'",
        [imovel.id]
      );
    }

    res.json({
      ...imovel,
      conteudo: conteudoResult.rows[0] || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});
const conteudoResult = await pool.query(
  "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 LIMIT 1",
  [imovel.id]
);

const conteudo = conteudoResult.rows[0] || {};
return res.json({
  etapa: "conteudo_ok",
  conteudo: conteudoResult.rows
});
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
