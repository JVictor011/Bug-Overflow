const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.get("/auth/github", AuthController.githubAuth);
router.get("/auth/github/callback", AuthController.githubCallback);
router.get("/auth/google", AuthController.googleAuth);
router.get("/auth/google/callback", AuthController.googleCallback);
router.get("/auth/logout", AuthController.logout);
router.get("/auth/login", AuthController.login);
router.get("/auth/logout-user", AuthController.logoutUser);
router.get("/auth/register", AuthController.register);
router.get("/", AuthController.checkAuthAndRedirect);

module.exports = router;
