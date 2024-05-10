const Pergunta = require("../database/models/pergunta");
const { Sequelize, Op } = require("sequelize");
const { processarMarkdown } = require("../utils/markdownUtils");
const { findBestMatch } = require("string-similarity");

exports.buscarPerguntas = async (req, res) => {
  try {
    const buscar = req.body.buscar.toLowerCase();
    const todasPerguntas = await Pergunta.findAll({ raw: true });

    const buscaBD = await Pergunta.findAll({
      raw: true,
      where: {
        [Sequelize.Op.or]: [
          { titulo: { [Op.iLike]: `%${buscar}%` } },
          { descricao: { [Op.iLike]: `%${buscar}%` } },
          { username: { [Op.iLike]: `%${buscar}%` } },
        ],
      },
    });

    const todasAsStrings = todasPerguntas.map(
      (pergunta) =>
        `${pergunta.titulo.toLowerCase()} ${pergunta.descricao.toLowerCase()} ${pergunta.username.toLowerCase()}`
    );

    const match = findBestMatch(buscar, todasAsStrings);

    const limiar = 0.05;
    const melhorCorrespondencia = match.ratings
      .filter(({ rating }) => rating > limiar)
      .map(({ target }) => target);

    console.log("rating: ", match);
    console.log(
      "Melhores correspondências encontradas: ",
      melhorCorrespondencia
    );

    const todasPerguntasFiltradas = melhorCorrespondencia
      .map((correspondencia) =>
        todasPerguntas.find(
          (pergunta) =>
            `${pergunta.titulo.toLowerCase()} ${pergunta.descricao.toLowerCase()} ${pergunta.username.toLowerCase()}` ===
            correspondencia
        )
      )
      .filter(
        (pergunta) => !buscaBD.find((result) => result.id === pergunta.id)
      );

    console.log("todasPerguntasFiltradas: ", todasPerguntasFiltradas);
    console.log("buscaBD: ", buscaBD);

    buscaBD.forEach((pergunta) => {
      todasPerguntasFiltradas.unshift(pergunta);
    });
    console.log("Perguntas Filtradas: ", todasPerguntasFiltradas);

    const perguntasCorrespondentes =
      todasPerguntasFiltradas.map(processarMarkdown);

    res.render("index", { perguntas: perguntasCorrespondentes });
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).send("Erro interno no servidor");
  }
};
