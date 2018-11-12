	
const express = require('express'),
router = express.Router();
const battle = require('../controllers/battleControllers');

router.get('/list', battle.listBattle);
router.get('/count', battle.countBattle);
router.get('/stats', battle.statsBattle);
router.get('/search', battle.searchBattle);

module.exports = router;