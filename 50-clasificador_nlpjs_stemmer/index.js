const { StemmerEs } = require('@nlpjs/lang-es');
const { NeuralNetwork } = require('@nlpjs/neural');
const corpus = require('./corpus-es.json');

const stemmer = new StemmerEs();

function arrToObject(arr) {
  const result = {};
  arr.forEach(word => {
    result[word] = 1;
  });
  return result;
}

function formatUtterance(utterance, intent) {
  return {
    input: arrToObject(stemmer.tokenizeAndStem(utterance)),
    output: arrToObject([intent])
  }
}

function buildTrainData() {
  const result = [];
  corpus.data.forEach(item => {
    item.utterances.forEach(utterance => {
      result.push(formatUtterance(utterance, item.intent));
    });
  });
  return result;
}

function formatOutput(output) {
  const result = [];
  Object.keys(output).forEach(key => {
    result.push({ label: key, score: output[key] });
  });
  return result.sort((a, b) => b.score - a.score);
}

const trainData = buildTrainData();
const net = new NeuralNetwork({ log: true });
net.train(trainData);
let total = 0;
let good = 0;
corpus.data.forEach(item => {
  item.tests.forEach(test => {
    const validationData = formatUtterance(test, item.intent);
    const output = net.run(validationData.input);
    const classifications = formatOutput(output);
    total += 1;
    if (classifications[0].label === item.intent) {
      good += 1;
    }
  });
});
console.log(`${good} good of a total of ${total} (${good * 100 / total}%)`);