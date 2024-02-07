const express = require("express");
const app = express();
const connection = require("./database/database");
const markdownIt = require("markdown-it");
const md = new markdownIt();
const { Sequelize, Op } = require("sequelize");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./OAuth/githubOAuth");
const crypto = require("crypto");
const secretkey = crypto.randomBytes(64).toString("hex");
require("./OAuth/googleOAuth");

//Router
const homeRouter = require("./routes/homeRouter");
const askRouter = require("./routes/AskRouter");
const answerRouter = require("./routes/AnswerRouter");
const searchRouter = require("./routes/SearchRouter");
const authRouter = require("./routes/AuthRouter");

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

app.use("/", homeRouter);
app.use("/", askRouter);
app.use("/", answerRouter);
app.use("/", searchRouter);
app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
