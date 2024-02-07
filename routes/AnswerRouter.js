const express = require("express");
const router = express.Router();
const AnswerController = require("../controllers/AnswerController");

router.post("/salvarResposta", AnswerController.salvarResposta);

module.exports = router;
