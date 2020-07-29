const { MarkovChain } = require('@nlpjs/utils');
const fs = require('fs');

// const input = `Tres Anillos para los Reyes Elfos bajo el cielo.
// Siete para los Señores Enanos en palacios de piedra.
// Nueve para los Hombres Mortales condenados a morir.
// Uno para el Señor Oscuro, sobre el trono oscuro
// en la Tierra de Mordor donde se extienden las Sombras.
// Un Anillo para gobernarlos a todos. Un Anillo para encontrarlos,
// un Anillo para atraerlos a todos y atarlos en las tinieblas
// en la Tierra de Mordor donde se extienden las Sombras`;

const input = fs.readFileSync('./book.txt', 'utf8');
const chain = new MarkovChain({ text: input });
const actual = chain.predictNext('para los alumnos, alguno comenzó a');
console.log(actual);
const text = chain.randomSentence('para los alumnos', 200);
console.log(text);