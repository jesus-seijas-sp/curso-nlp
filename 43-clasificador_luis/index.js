require('dotenv').config();
const { NluLuis } = require('@nlpjs/nlu-luis');
const corpus = require('./corpus-es.json');
const fs = require('fs');

function exportCorpus() {
  const luis = new NluLuis();
  const luisFormat = luis.fromCorpus(corpus);
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
      const test = item.tests[j];
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

main();