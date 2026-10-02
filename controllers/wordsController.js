const Word = require('../models/Word');

exports.index = (req, res) => {
  res.render('words', {
    title: 'Словник',
    active: 'words',
    words: Word.all(),
  });
};

exports.api = (req, res) => {
  const from = parseInt(req.query.from, 10) || 1;
  const to = parseInt(req.query.to, 10) || Word.count();
  res.json(Word.range(from, to));
};
