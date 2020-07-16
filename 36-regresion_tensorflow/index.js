const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const trainRatio = .75;

function sexToNumber(sex) {
  switch(sex) {
    case 'F': return 0;
    case 'M': return 1;
    default: return 0.5;
  }
}

function createDataset(fileName) {
  const options = { hasHeader: true, columnConfigs: { rings: { isLabel: true }}};
  return tf.data.csv(`file://${fileName}`, options).map(row => ({
    xs: Object.values(row.xs).map((x, i) => i === 0 ? sexToNumber(x) : x), 
    ys: [row.ys.rings]
  }));
}

function createModel(inputShape, activation = 'sigmoid', lr = 0.01) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape, activation, units: inputShape[0] * 4 }));
  model.add(tf.layers.dense({ activation, units: inputShape[0] * 2 }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: tf.train.sgd(lr), loss: 'meanSquaredError' });
  return model;
}

function getCsvSize(fileName) {
  const lines = fs.readFileSync(fileName, 'utf8').split(/\r?\n/g);
  return {
    rows: lines.length - 1,
    columns: lines[0].split(',').length,
  }
}

async function train({ model, dataset, numRows, batchSize, epochs }) {
  const trainLength = Math.floor(numRows * trainRatio);
  const trainBatches = Math.floor(trainLength / batchSize);
  const shuffledDataset = dataset.shuffle(100).batch(batchSize);
  const trainDataset = shuffledDataset.take(trainBatches);
  const testDataset = shuffledDataset.skip(trainBatches);
  await model.fitDataset(trainDataset, { epochs, validationData: testDataset });
}

// M,0.58,0.47,0.165,0.9975,0.3935,0.242,0.33,10
// F,0.68,0.56,0.165,1.639,0.6055,0.2805,0.46,15
// M,0.665,0.525,0.165,1.338,0.5515,0.3575,0.35,18

const tests = [
  [1,0.58,0.47,0.165,0.9975,0.3935,0.242,0.33],
  [0,0.68,0.56,0.165,1.639,0.6055,0.2805,0.46],
  [1,0.665,0.525,0.165,1.338,0.5515,0.3575,0.35],    
];

async function main(csvName) {
  const dataset = createDataset(csvName);
  const size = getCsvSize(csvName);
  const model = createModel([size.columns - 1]);
  await train({ model, dataset, numRows: size.rows, epochs: 50, batchSize: 100 });
  for (let i = 0; i < tests.length; i += 1) {
    const test = tests[i];
    const result = model.predict(tf.tensor2d([test]));
    console.log(result.dataSync());
  }
}

const csvName = './abalone.csv';
main(csvName);