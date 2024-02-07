const Resposta = require("../database/models/resposta");
const { Sequelize, Op } = require("sequelize");

exports.salvarResposta = async (req, res) => {
  try {
    const { corpoResposta, idResposta } = req.body;

    if (req.isAuthenticated()) {
      const username = req.user.username;

      await Resposta.create({
        corpo: corpoResposta,
        perguntaId: idResposta,
        username: username,
      });

      res.redirect("/pergunta/" + idResposta);
    } else {
      console.log("Usuário não autenticado");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    res.status(500).send("Erro interno no servidor");
  }
};