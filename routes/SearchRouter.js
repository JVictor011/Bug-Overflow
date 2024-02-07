const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/SearchController");

router.post("/buscar", SearchController.buscarPerguntas);

module.exports = router;