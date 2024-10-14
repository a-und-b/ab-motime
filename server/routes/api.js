const express = require('express');
const router = express.Router();
const timingController = require('../controllers/timingController');
const mocoController = require('../controllers/mocoController');

// Timing routes
router.get('/timing', timingController.getTimingData);
router.post('/timing', timingController.addTimingEntry);

// Moco routes
router.get('/moco', mocoController.getMocoData);
router.post('/moco', mocoController.addMocoEntry);

module.exports = router;
