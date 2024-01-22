const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");
const Resposta = require("./database/resposta");
const markdownIt = require("markdown-it");
const md = new markdownIt();
const { Sequelize, Op } = require('sequelize');

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conectado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro na conexão:", error);
  });

const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Função para processar Markdown
function processarMarkdown(pergunta) {
  return {
    ...pergunta,
    descricaoMarkdown: md.render(pergunta.descricao),
  };
}

function processarMarkdownResposta(resposta) {
  return {
    ...resposta,
    corpoMarkdown: md.render(resposta.corpo),
  };
}

// Rota para exibir todas as perguntas
app.get("/", async (req, res) => {
  try {
    const perguntas = await Pergunta.findAll({
      raw: true,
      order: [["id", "DESC"]],
    });

    const perguntasMarkdown = perguntas.map(processarMarkdown);

    res.render("index", { perguntas: perguntasMarkdown });
  } catch (error) {
    console.error("Erro ao obter perguntas:", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    await Pergunta.create({
      titulo,
      descricao,
      status: true,
    });
    res.redirect("/");
  } catch (error) {
    console.error("Erro ao salvar pergunta:", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/pergunta/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pergunta = await Pergunta.findOne({ raw: true, where: { id } });
    const resposta = await Resposta.findAll({
      raw: true,
      order: [["id", "DESC"]],
      where: { perguntaId: id },
    });

    if (pergunta) {
      const perguntaMarkdown = processarMarkdown(pergunta);
      const respostaMarkdown = resposta.map(processarMarkdownResposta);
      res.render("respostas", {
        pergunta: perguntaMarkdown,
        respostas: respostaMarkdown,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Erro ao obter pergunta por ID:", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/salvarResposta", async (req, res) => {
  try {
    const { corpoResposta, idResposta } = req.body;
    console.log(corpoResposta);
    console.log(idResposta);

    await Resposta.create({
      corpo: corpoResposta,
      perguntaId: idResposta,
      username: "userTest",
    });
    res.redirect("/pergunta/" + idResposta);
  } catch (error) {
    console.error("Erro ao obter pergunta por ID:", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/buscar", async (req, res) => {
  try {
    const buscar = req.body.buscar;
    const resultadoBusca = await Pergunta.findAll({
      raw: true,
      where: {
        [Sequelize.Op.or]: [
          { titulo: { [Op.like]: `%${buscar}%` } },
          { descricao: { [Op.like]: `%${buscar}%` } },
          { username: { [Op.like]: `%${buscar}%` } },
        ],
      },
    });
    const buscaComMakedown = resultadoBusca.map(processarMarkdown);
    res.render("index", { perguntas: buscaComMakedown });
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).send("Erro interno no servidor");
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
