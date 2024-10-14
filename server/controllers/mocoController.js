const mocoClient = require('../utils/mocoClient');
const axios = require('axios');
const logger = require('../utils/logger');

const mocoApi = axios.create({
  baseURL: `https://${process.env.MOCO_DOMAIN}.mocoapp.com/api/v1`,
  headers: {
    'Authorization': `Token token=${process.env.MOCO_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

exports.getMocoData = async (req, res) => {
  try {
    const response = await mocoClient.get('/activities');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Moco data:', error);
    res.status(500).json({ error: 'Error fetching Moco data' });
  }
};

exports.addMocoEntry = async (req, res, next) => {
  try {
    const { date, project_id, task_id, hours, description } = req.body;
    
    const response = await mocoApi.post('/activities', {
      date,
      project_id,
      task_id,
      hours,
      description
    });

    res.json(response.data);
  } catch (error) {
    logger.error('Error adding Moco entry:', error.response ? error.response.data : error.message);
    next(error);
  }
};

exports.getMocoProjects = async (req, res, next) => {
  try {
    const response = await mocoApi.get('/projects');
    res.json(response.data);
  } catch (error) {
    logger.error('Error fetching Moco projects:', error.response ? error.response.data : error.message);
    next(error);
  }
};

exports.getMocoTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const response = await mocoApi.get(`/projects/${projectId}/tasks`);
    res.json(response.data);
  } catch (error) {
    logger.error('Error fetching Moco tasks:', error.response ? error.response.data : error.message);
    next(error);
  }
};
