const Word = require('../models/Word');

exports.index = (req, res) => {
  res.render('home', {
    title: 'Які слова вчимо?',
    active: 'home',
    decks: Word.decks(),
  });
};
