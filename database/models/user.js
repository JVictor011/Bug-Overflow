const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const connection = require("../database");

const User = connection.define("user", {
  OAuthId: {
    type: Sequelize.STRING,
    unique: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
    set(password) {
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        this.setDataValue("password", hashedPassword);
      }
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: { isEmail: true },
  },
});

User.prototype.validPassword = function (password) {
  return this.password && bcrypt.compareSync(password, this.password);
};

User.sync({ force: false }).then(() => {
  console.log("Tabela de usuários criada!");
});

module.exports = User;
