const mocoClient = require('../utils/mocoClient');

exports.getMocoData = async (req, res) => {
  try {
    const response = await mocoClient.get('/activities');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Moco data:', error);
    res.status(500).json({ error: 'Error fetching Moco data' });
  }
};

exports.addMocoEntry = async (req, res) => {
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
    console.error('Error adding Moco entry:', error);
    res.status(500).json({ error: 'Error adding Moco entry' });
  }
};
