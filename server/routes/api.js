const express = require('express');
const router = express.Router();
const timingController = require('../controllers/timingController');
const mocoController = require('../controllers/mocoController');

// Timing routes
router.get('/timing', timingController.getTimingData);

// Moco routes
router.get('/moco/projects', mocoController.getMocoProjects);
router.get('/moco/projects/:projectId/tasks', mocoController.getMocoTasks);
router.post('/moco/activities', mocoController.addMocoEntry);

module.exports = router;
