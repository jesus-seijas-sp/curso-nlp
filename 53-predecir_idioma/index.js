const { NGrams } = require('@nlpjs/utils');
const fs = require('fs');

const ngrams = new NGrams();
const languageTrigrams = {};

function processFile(fileName, locale) {
  const lines = fs.readFileSync(fileName, 'utf8').split(/\r?\n/);
  const trigrams = ngrams.getNGramsFreqs(lines, 3, true);
  languageTrigrams[locale] = trigrams;
}

function getLanguageScore(trigrams, locale) {
  const langTrigrams = languageTrigrams[locale];
  if (!langTrigrams) {
    return 0;
  }
  let result = 0;
  trigrams.forEach(trigram => {
    result += langTrigrams[trigram] || 0;
  });
  return result;
}

function guessLanguage(text) {
  const trigrams = ngrams.getNGrams(text);
  const result = [];
  Object.keys(languageTrigrams).forEach(locale => {
    const score = getLanguageScore(trigrams, locale);
    result.push({ locale, score });
  });
  return result.sort((a, b) => b.score - a.score);
}

processFile('./wikipedia_en.txt', 'en');
processFile('./wikipedia_es.txt', 'es');
processFile('./wikipedia_fr.txt', 'fr');
const outputEn = guessLanguage('this sentence should be classified as english');
console.log(outputEn);
const outputEs = guessLanguage('Esta frase debería ser clasificada como español');
console.log(outputEs);
const outputFr = guessLanguage('Cette phrase doit être classée comme française');
console.log(outputFr);