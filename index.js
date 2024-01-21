const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conectado com sucesso!");
  })
  .catch((msgERROR) => {
    console.log(msgERROR);
  });

const PORT = process.env.PORT || 5000;

// EJS como view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// Configurar o uso do bodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  res.send("Titulo: " + titulo + " Descrição:" + descricao);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
