const { NeuralNetwork } = require('brain.js');
const { TokenizerEs } = require('@nlpjs/lang-es');
const corpus = require('./corpus-es.mini.json');
const Lookup = require('./lookup');

const tokenizer = new TokenizerEs();

function buildLookups() {
  const { data } = corpus;
  const result = {
    featureLookup: new Lookup(),
    intentLookup: new Lookup(),
  }
  data.forEach(item => {
    result.intentLookup.add(item.intent);
    item.utterances.forEach(utterance => {
      result.featureLookup.add(tokenizer.tokenize(utterance, true));
    });
  });
  return result;
}

function formatUtterance(lookups, utterance, intent) {
  return {
    input: lookups.featureLookup.arrToVector(tokenizer.tokenize(utterance, true)),
    output: lookups.intentLookup.arrToVector([intent]),
  }
}

const lookups = buildLookups();
const trainData = [];
corpus.data.forEach(item => {
  item.utterances.forEach(utterance => {
    trainData.push(formatUtterance(lookups, utterance, item.intent));
  });
});

const netOptions = {
  log: (str) => console.log(str),
  logPeriod: 10,
  hiddenLayers: [],
  activation: 'leaky-relu',
  learningRate: 0.7,
  momentum: 0.5,
  alpha: 0.08,
  errorThresh: 0.00005,
}

const net = new NeuralNetwork();
net.train(trainData, netOptions);

let total = 0;
let good = 0;
corpus.data.forEach(item => {
  item.tests.forEach(test => {
    const formatted = formatUtterance(lookups, test, item.intent);
    const output = net.run(formatted.input);
    const classifications = lookups.intentLookup.vectToOutput(output);
    console.log(classifications);
    total += 1;
    if (classifications[0].label === item.intent) {
      good += 1;
    }
  });
});

console.log(`${good} good of a total of ${total} (${good*100/total}%)`);
