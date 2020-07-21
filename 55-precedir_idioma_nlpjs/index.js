const { Language } = require('@nlpjs/language');

const language = new Language();
const allowList = ['en', 'es', 'fr'];
const output = language.guessBest('This is a sentence', allowList);
console.log(output);
