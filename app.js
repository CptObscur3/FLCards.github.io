const path = require('path');
const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// URL prefix for links and assets: "/" locally, "/<repo>/" on GitHub Pages.
app.locals.base = (process.env.BASE_PATH || '').replace(/\/+$/, '') + '/';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Не знайдено', active: '' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Vcards running at http://localhost:${PORT}`);
  });
}

module.exports = app;
