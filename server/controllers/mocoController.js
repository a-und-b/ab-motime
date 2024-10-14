const mocoClient = require('../utils/mocoClient');
const logger = require('../utils/logger');

exports.getMocoData = async (req, res, next) => {
  try {
    const response = await mocoClient.get('/activities');
    res.json(response.data);
  } catch (error) {
    logger.error('Error fetching Moco data:', error);
    next(error);
  }
};

exports.addMocoEntry = async (req, res, next) => {
  try {
    const { date, projectId, taskId, hours, description } = req.body;
    const response = await mocoClient.post('/activities', {
      date,
      project_id: projectId,
      task_id: taskId,
      hours,
      description
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Error adding Moco entry:', error);
    next(error);
  }
};
