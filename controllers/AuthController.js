const express = require("express");
const { Sequelize, Op } = require("sequelize");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("../OAuth/githubOAuth");
const User = require("../database/models/user");
const session = require("express-session");
require("../OAuth/googleOAuth");

exports.githubAuth = passport.authenticate("github", { scope: ["user:email"] });

exports.githubCallback = passport.authenticate("github", {
  failureRedirect: "/login",
  successRedirect: "/home",
});

exports.googleAuth = passport.authenticate("google", { scope: ["profile"] });

exports.googleCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/home",
});

exports.logout = (req, res) => {
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
};

exports.checkAuthAndRedirect = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    res.render("login.ejs", { user: req.user });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    await User.create({
      username,
      password,
      email,
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ raw: true, where: { username } });

    if (user && user.validPassword(password)) {
      req.session.username = username;
      res.redirect("/home");
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }
};

exports.logoutUserForm = (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erro ao encerrar a sessão");
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }
};
