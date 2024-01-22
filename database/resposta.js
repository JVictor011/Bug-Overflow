const Sequelize = require('sequelize');
const connection = require('./database');

const Resposta = connection.difine(("respostas", {
    corpo:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
}));