class Lookup {
  constructor() {
    this.dict = {};
    this.items = [];
  }

  add(item) {
    if (Array.isArray(item)) {
      item.forEach(word => this.add(word));
    } else {
      if (this.dict[item] === undefined) {
        this.dict[item] = this.items.length;
        this.items.push(item);
      }
    }
  }

  arrToVector(arr) {
    const result = [];
    for (let i = 0; i < this.items.length; i += 1) {
      result.push(0);
    }
    arr.forEach(word => {
      if (this.dict[word] !== undefined) {
        result[this.dict[word]] = 1;
      }
    });
    return result;
  }

  vectToOutput(vect) {
    const result = [];
    for (let i = 0; i < vect.length; i += 1) {
      result.push({ label: this.items[i], score: vect[i] });
    }
    return result.sort((a, b) => b.score - a.score);
  }
}

module.exports = Lookup;