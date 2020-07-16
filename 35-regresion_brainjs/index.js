const abalone = require('./abalone.json');
const { NeuralNetwork } = require('brain.js');

const ratio = 29;
const trainRatio = .75;

// { input: [], output: [] }
function sexToNumber(sex) {
  switch(sex) {
    case 'F': return 0;
    case 'M': return 1;
    default: return 0.5;
  }
}

function createData(data) {
  const result = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    const values = Object.values(item).slice(0, -1);
    values[0] = sexToNumber(values[0]);
    result.push({ input: values, output: [item.rings / ratio] });
  }
  return result;
}

const data = createData(abalone).sort(() => Math.random() - .5);
const trainLength = Math.floor(data.length * trainRatio);
const trainData = data.slice(0, trainLength);
const testData = data.slice(trainLength);

const net = new NeuralNetwork();
net.train(trainData, {
  iterations: 500,
  hiddenLayers: [],
  log: (str) => console.log(str),
  logPeriod: 10,
});

let totalError = 0;
for (let i = 0; i < testData.length; i += 1) {
  const item = testData[i];
  const output = net.run(item.input);
  totalError += (output[0] - item.output[0]) ** 2;
}
console.log(totalError/testData.length);