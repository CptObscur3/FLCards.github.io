// Renders every page through the real controllers + views into dist/,
// producing a static site that GitHub Pages can host.
const fs = require('fs');
const path = require('path');
const app = require('../app');
const Word = require('../models/Word');
const homeController = require('../controllers/homeController');
const studyController = require('../controllers/studyController');
const wordsController = require('../controllers/wordsController');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Runs a controller action with a minimal req/res and resolves to the rendered HTML.
function render(action, params = {}) {
  return new Promise((resolve, reject) => {
    const res = {
      render(view, locals) {
        app.render(view, locals, (err, html) => (err ? reject(err) : resolve(html)));
      },
    };
    action({ params, query: {} }, res, () => reject(new Error(`No page for ${JSON.stringify(params)}`)));
  });
}

function write(relPath, content) {
  const file = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('  ' + relPath);
}

async function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, 'public'), DIST, { recursive: true });
  console.log(`Building with base "${app.locals.base}"`);

  write('index.html', await render(homeController.index));
  write('words/index.html', await render(wordsController.index));
  for (const deck of Word.decks()) {
    write(`study/${deck.id}/index.html`, await render(studyController.show, { deckId: deck.id }));
  }
  write('404.html', await new Promise((resolve, reject) =>
    app.render('404', { title: 'Не знайдено', active: '' }, (err, html) => (err ? reject(err) : resolve(html)))));
  write('api/words.json', JSON.stringify(Word.all()));
  write('.nojekyll', '');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
