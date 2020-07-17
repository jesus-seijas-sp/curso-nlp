const { NormalizerEs } = require('@nlpjs/lang-es');

const input = '¿Quién es tu Programador?';

const normalizer = new NormalizerEs();
const output = normalizer.normalize(input);
console.log(output);

function normalize(text) {
  const result = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return result;
}

console.log(normalize(input));