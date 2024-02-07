const express = require("express");
const router = express.Router();
const AskController = require("../controllers/AskController");

router.get("/perguntar", AskController.getPerguntar);
router.get("/pergunta/:id", AskController.getPerguntaById);
router.post("/salvarpergunta", AskController.salvarPergunta);

module.exports = router;