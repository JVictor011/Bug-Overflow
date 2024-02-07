const Sequelize = require("sequelize");
const connection = require("../database");

const Resposta = connection.define("respostas", {
  corpo: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  perguntaId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Resposta.sync({ force: false }).then(() => {
  console.log("Tabela respostas criada!");
});

module.exports = Resposta;
