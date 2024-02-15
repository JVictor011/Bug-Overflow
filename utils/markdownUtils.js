const markdownIt = require("markdown-it");
const md = new markdownIt();

function processarMarkdown(pergunta) {
  if (pergunta && pergunta.descricao) {
    return {
      ...pergunta,
      descricaoMarkdown: md.render(pergunta.descricao),
    };
  } else {
    return {};
  }
}

function processarMarkdownResposta(resposta) {
  return {
    ...resposta,
    corpoMarkdown: md.render(resposta.corpo),
  };
}

module.exports = { processarMarkdown, processarMarkdownResposta };
