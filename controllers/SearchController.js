const Pergunta = require("../database/models/pergunta");
const { Sequelize, Op } = require("sequelize");
const { processarMarkdown } = require("../utils/markdownUtils");

exports.buscarPerguntas = async (req, res) => {
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
    const buscaComMarkdown = resultadoBusca.map(processarMarkdown);
    res.render("index", { perguntas: buscaComMarkdown });
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).send("Erro interno no servidor");
  }
};