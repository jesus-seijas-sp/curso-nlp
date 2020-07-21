const { NGrams } = require('@nlpjs/utils');
const fs = require('fs');

const gramsByChar = new NGrams();
const gramsByWord = new NGrams({ byWord: true });

const input = 'La casa por el tejado la pared por abajo la cama sin hacer';
const outputByChar = gramsByChar.getNGrams(input, 4);
const outputByWord = gramsByWord.getNGrams(input, 4);
console.log(outputByChar);
console.log(outputByWord);

const freqByChar = gramsByChar.getNGramsFreqs(input, 2, true);
console.log(freqByChar);

const lines = fs.readFileSync('./wikipedia_es.txt', 'utf8').split(/\r?\n/);
const freqFile = gramsByChar.getNGramsFreqs(lines);
console.log(freqFile);