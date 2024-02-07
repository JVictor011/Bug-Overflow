const Pergunta = require("../database/models/pergunta");
const Resposta = require("../database/models/resposta");
const { Sequelize, Op } = require("sequelize");
const { processarMarkdown, processarMarkdownResposta } = require("../utils/markdownUtils");

exports.getPerguntar = (req, res) => {
  res.render("perguntar");
};

exports.getPerguntaById = async (req, res) => {
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
      res.redirect("/home");
    }
  } catch (error) {
    console.error("Erro ao obter pergunta por ID:", error);
    res.status(500).send("Erro interno no servidor");
  }
};

exports.salvarPergunta = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;

    if (req.isAuthenticated()) {
      const username = req.user.username;

      await Pergunta.create({
        titulo,
        descricao,
        status: true,
        username: username,
      });

      res.redirect("/home");
    } else {
      console.log("Usuário não autenticado");
      res.redirect("/");
    }
  } catch (error) {
    console.error("Erro ao salvar pergunta:", error);
    res.status(500).send("Erro interno no servidor");
  }
};