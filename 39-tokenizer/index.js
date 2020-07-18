const { TokenizerEs } = require('@nlpjs/lang-es');

const tokenizerEs = new TokenizerEs();
const inputEs = '¿Quién es tu programador?';
const outputEs = tokenizerEs.tokenize(inputEs, false);
console.log(outputEs);

function tokenize(text) {
  return text.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter(x => x);
}

console.log(tokenize(inputEs));

const inputEn = `I didn't finish this task, I cannot end today, I'll finish tomorrow`;
const { AggressiveTokenizer, TreebankWordTokenizer } = require('natural');
const aggresive = new AggressiveTokenizer();
console.log(aggresive.tokenize(inputEn));
const treebank = new TreebankWordTokenizer();
console.log(treebank.tokenize(inputEn));

const { TokenizerEn } = require('@nlpjs/lang-en');
const tokenizerEn = new TokenizerEn();
console.log(tokenizerEn.tokenize(inputEn));