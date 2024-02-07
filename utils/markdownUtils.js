const markdownIt = require("markdown-it");
const md = new markdownIt();

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

module.exports = { processarMarkdown, processarMarkdownResposta };