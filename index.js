const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");
const markdownIt = require('markdown-it');
const md = new markdownIt();

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
  Pergunta.findAll({ raw: true }).then((perguntas) => {
    // Processar e exibir as perguntas em Markdown
    res.render("index", {
      perguntas: perguntas.map(pergunta => {
        // Use o markdown-it para processar o conteúdo Markdown da descrição
        return {
          ...pergunta,
          descricaoMarkdown: md.render(pergunta.descricao),
        };
      }),
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var { titulo, descricao } = req.body;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
    status: true,
  }).then(() => {
    res.redirect("/");
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
