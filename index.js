const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");
const Resposta = require("./database/resposta");
const User = require("./database/user");
const markdownIt = require("markdown-it");
const md = new markdownIt();
const { Sequelize, Op } = require("sequelize");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./back-end/OAuth/auth");
const crypto = require("crypto");
const secretkey = crypto.randomBytes(64).toString("hex");
require("./back-end/OAuth/googleOAuth");

connection
  .authenticate()
  .then(() => {
    console.log("Conectado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro na conexão:", error);
  });

const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: secretkey,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

function processarMarkdown(pergunta) {
  return {
    ...pergunta,
    descricaoMarkdown: md.render(pergunta.descricao),
  };
}

function processarMarkdownResposta(resposta) {
  return {
    ...resposta,
    corpoMarkdown: md.render(resposta.corpo),
  };
}

app.get("/home", async (req, res) => {
  try {
    const perguntas = await Pergunta.findAll({
      raw: true,
      order: [["id", "DESC"]],
    });

    const perguntasMarkdown = perguntas.map(processarMarkdown);

    res.render("index", { perguntas: perguntasMarkdown });
  } catch (error) {
    console.error("Erro ao obter perguntas:", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", async (req, res) => {
  try {
    const { titulo, descricao } = req.body;

    if (req.isAuthenticated()) {
      const username = req.user.username;

      await Pergunta.create({
        titulo,
        descricao,
        status: true,
        username: username,
      });

      res.redirect("/home");
    } else {
      console.log("Usuário não autenticado");
      res.redirect("/");
    }
  } catch (error) {
    console.error("Erro ao salvar pergunta:", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/pergunta/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pergunta = await Pergunta.findOne({ raw: true, where: { id } });
    const resposta = await Resposta.findAll({
      raw: true,
      order: [["id", "DESC"]],
      where: { perguntaId: id },
    });

    if (pergunta) {
      const perguntaMarkdown = processarMarkdown(pergunta);
      const respostaMarkdown = resposta.map(processarMarkdownResposta);
      res.render("respostas", {
        pergunta: perguntaMarkdown,
        respostas: respostaMarkdown,
      });
    } else {
      res.redirect("/home");
    }
  } catch (error) {
    console.error("Erro ao obter pergunta por ID:", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/salvarResposta", async (req, res) => {
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
});

app.post("/buscar", async (req, res) => {
  try {
    const buscar = req.body.buscar;
    const resultadoBusca = await Pergunta.findAll({
      raw: true,
      where: {
        [Sequelize.Op.or]: [
          { titulo: { [Op.like]: `%${buscar}%` } },
          { descricao: { [Op.like]: `%${buscar}%` } },
          { username: { [Op.like]: `%${buscar}%` } },
        ],
      },
    });
    const buscaComMakedown = resultadoBusca.map(processarMarkdown);
    res.render("index", { perguntas: buscaComMakedown });
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/home");
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/home");
  }
);

app.get("/auth/logout", (req, res) => {
  try {
    if (req.isAuthenticated()) {
      req.logout(function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send("Erro interno no servidor");
        }
        res.redirect("/");
      });
    } else {
      console.log("Usuário não autenticado");
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    res.render("login.ejs", { user: req.user });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});