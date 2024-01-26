# Documentação do Código

## 1. Conexão com o Banco de Dados

O código inicia importando os módulos necessários e configurando a conexão com o banco de dados usando o Sequelize.

```javascript
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
const authRoutes = require("./auth");
const crypto = require("crypto");
const secretkey = crypto.randomBytes(64).toString("hex");
```

## 2. Configuração do Express e Middleware

A aplicação Express é configurada para usar o EJS como mecanismo de visualização, servir arquivos estáticos da pasta "public" e processar dados do formulário.

```javascript
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
```

## 3. Configuração da Sessão e Autenticação com Passport

O código configura a sessão e utiliza o Passport para autenticação.

```javascript
app.use(
  session({
    secret: secretkey,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
```

## 4. Funções Auxiliares de Markdown

Funções para processar texto em markdown são definidas.

```javascript
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
```

## 5. Rotas Principais

Rotas para renderizar a página inicial, a página de perguntas e processar o formulário de perguntas.

```javascript
app.get("/home", async (req, res) => {
  // ...
});

app.get("/perguntar", (req, res) => {
  // ...
});

app.post("/salvarpergunta", async (req, res) => {
  // ...
});
```

## 6. Rotas de Pergunta e Resposta

Rotas para exibir perguntas específicas, processar respostas e buscar perguntas.

```javascript
app.get("/pergunta/:id", async (req, res) => {
  // ...
});

app.post("/salvarResposta", async (req, res) => {
  // ...
});

app.post("/buscar", async (req, res) => {
  // ...
});
```

## 7. Rotas de Autenticação

Rotas relacionadas à autenticação usando o Passport e GitHub OAuth.

```javascript
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/home");
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/", (req, res) => {
  // ...
});
```

## 8. Inicialização do Servidor

Finalmente, o servidor é inicializado para escutar em uma porta especificada.

```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
```
