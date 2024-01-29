const Sequelize = require("sequelize");

const connection = new Sequelize({
  dialect: 'postgres',
  host: 'monorail.proxy.rlwy.net',
  port: 55705,
  username: 'postgres',
  password: '6*5EdBF2ag23fB6a1DBacBAeb-BfEEc3',
  database: 'railway'
});

module.exports = connection;