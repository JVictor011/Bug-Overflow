const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define("perguntas", {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
  },
  status:{
    type: Sequelize.BOOLEAN,
  }
});

Pergunta.sync({ force: false }).then(() => {
  console.log("Tabela perguntas criada!");
});

module.exports = Pergunta;