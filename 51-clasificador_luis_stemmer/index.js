require('dotenv').config();
const { NluLuis } = require('@nlpjs/nlu-luis');
const { StemmerEs } = require('@nlpjs/lang-es');
const corpus = require('./corpus-es.json');
const fs = require('fs');

const stemmer = new StemmerEs();

function exportCorpus() {
  const luis = new NluLuis();
  const luisFormat = luis.fromCorpus(corpus, (utterance) => stemmer.tokenizeAndStem(utterance).join(' '));
  fs.writeFileSync('./corpus-luis.json', JSON.stringify(luisFormat, null, 2), 'utf8');
}

async function main() {
  const luis = new NluLuis({
    luisUrl: process.env.LUIS_URL,
  });
  let total = 0;
  let good = 0;
  for (let i = 0; corpus.data.length; i += 1) {
    const item = corpus.data[i];
    for (let j = 0; j < item.tests.length; j += 1) {
      const test = stemmer.tokenizeAndStem(item.tests[j]).join(' ');
      const output = await luis.processUtterance(test);
      total += 1;
      if (output.prediction.topIntent === item.intent) {
        good += 1;
      }
    }
    console.log(`${good } good of a total ${total} (${good * 100 / total}%)`);
  }
  console.log(`${good } good of a total ${total} (${good * 100 / total}%)`);
}

// exportCorpus();
main();