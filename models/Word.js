const words = require('../data/words.json');

const DECK_SIZE = 50;

class Word {
  static all() {
    return words;
  }

  static count() {
    return words.length;
  }

  // Words with ids in [from, to], inclusive.
  static range(from, to) {
    return words.filter((w) => w.id >= from && w.id <= to);
  }

  // "All words" plus one deck per DECK_SIZE words: 1–50, 51–100, ...
  static decks() {
    const decks = [{ id: 'all', title: 'Всі слова', from: 1, to: words.length }];
    for (let from = 1; from <= words.length; from += DECK_SIZE) {
      const to = Math.min(from + DECK_SIZE - 1, words.length);
      const first = words[from - 1].en;
      const last = words[to - 1].en;
      decks.push({ id: `${from}-${to}`, title: `${from}–${to}`, subtitle: `${first} … ${last}`, from, to });
    }
    return decks.map((d) => ({ ...d, size: d.to - d.from + 1 }));
  }

  static findDeck(id) {
    return this.decks().find((d) => d.id === id) || null;
  }
}

module.exports = Word;
