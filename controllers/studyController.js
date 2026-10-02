const Word = require('../models/Word');

exports.show = (req, res, next) => {
  const deck = Word.findDeck(req.params.deckId);
  if (!deck) return next();

  res.render('study', {
    title: `Вчимо: ${deck.title}`,
    active: 'home',
    deck,
    words: Word.range(deck.from, deck.to),
  });
};
