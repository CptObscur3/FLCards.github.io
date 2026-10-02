const express = require('express');
const homeController = require('../controllers/homeController');
const studyController = require('../controllers/studyController');
const wordsController = require('../controllers/wordsController');

const router = express.Router();

router.get('/', homeController.index);
router.get('/study/:deckId', studyController.show);
router.get('/words', wordsController.index);
router.get('/api/words', wordsController.api);

module.exports = router;
