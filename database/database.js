const Sequelize = require("sequelize");

const connection = new Sequelize("bug_overflow", "root", "jovi", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
