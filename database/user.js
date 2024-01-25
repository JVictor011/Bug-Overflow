const Sequelize = require("sequelize");
const connection = require("./database");

const User = connection.define("user", {
  githubId: {
    type: Sequelize.STRING,
    unique: true,
  },
  username: {
    type: Sequelize.STRING,
  },
});

User.sync({ force: false }).then(() => {
  console.log("Tabela de usuários criada!");
});

module.exports = User;
