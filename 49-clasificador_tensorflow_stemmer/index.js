const tf = require('@tensorflow/tfjs-node');
const { StemmerEs } = require('@nlpjs/lang-es');
const corpus = require('./corpus-es.json');
const Lookup = require('./lookup');

const stemmer = new StemmerEs();

function buildLookups() {
  const { data } = corpus;
  const result = {
    featureLookup: new Lookup(),
    intentLookup: new Lookup(),
  }
  data.forEach(item => {
    result.intentLookup.add(item.intent);
    item.utterances.forEach(utterance => {
      result.featureLookup.add(stemmer.tokenizeAndStem(utterance));
    });
  });
  return result;
}

function formatUtterance(lookups, utterance, intent) {
  return {
    input: lookups.featureLookup.arrToVector(stemmer.tokenizeAndStem(utterance)),
    output: lookups.intentLookup.arrToVector([intent]),
  }
}

function createModel(numFeatures, numClasses) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [numFeatures], activation: 'linear', units: numClasses }));
  model.add(tf.layers.softmax());
  model.compile({
    optimizer: tf.train.adagrad(0.5),
    loss: 'categoricalCrossentropy'
  })  
  return model;
}

function getTrainingData(lookups) {
  const result = {
    xs: [],
    ys: []
  }
  corpus.data.forEach(item => {
    item.utterances.forEach(utterance => {
      const formatted = formatUtterance(lookups, utterance, item.intent);
      result.xs.push(formatted.input);
      result.ys.push(formatted.output);
    });
  });
  return result;
}

async function main() {
  const lookups = buildLookups();
  const model = createModel(lookups.featureLookup.items.length, lookups.intentLookup.items.length);
  const trainingData = getTrainingData(lookups);
  await model.fit(tf.tensor(trainingData.xs), tf.tensor(trainingData.ys), { epochs: 300 });
  let total = 0;
  let good = 0;
  corpus.data.forEach(item => {
    item.tests.forEach(test => {
      const formatted = formatUtterance(lookups, test, item.intent);
      const output = model.predict(tf.tensor([formatted.input]));
      const classifications = lookups.intentLookup.vectToOutput(output.dataSync());
      total += 1;
      if (classifications[0].label === item.intent) {
        good += 1;
      }
    });
  });
  console.log(`${good} good of a total of ${total} (${good*100/total}%)`);
}

main();