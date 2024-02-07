const Pergunta = require("../database/models/pergunta");
const { Sequelize, Op } = require("sequelize");
const { processarMarkdown } = require("../utils/markdownUtils");

exports.getHome = async (req, res) => {
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
};