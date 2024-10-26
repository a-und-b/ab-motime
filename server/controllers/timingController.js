const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { roundToQuarterHour } = require('../utils/timeUtils');
const timingDb = require('../services/timingDatabase');

const TIMING_DATA_PATH = path.join(__dirname, '../../timing.json');

function formatProjectName(path) {
  const [client, project] = path.split(' > ');
  return project ? `[${client}] ${project}` : path;
}

exports.getTimingData = async (req, res, next) => {
  try {
    const { period } = req.query;
    let startDate = new Date();
    let endDate = new Date();
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last7Days':
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last30Days':
      default:
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
    }

    await timingDb.connect();
    const activities = await timingDb.getTimeEntries(startDate, endDate);

    // Group by date and project
    const projectData = activities.reduce((acc, row) => {
      const { date, project_path, type, total_seconds, activity_count, app_names, task_title, task_notes } = row;
      
      if (!acc[date]) {
        acc[date] = {};
      }
      
      const formattedProjectName = formatProjectName(project_path);
      
      acc[date][formattedProjectName] = {
        type,
        duration_seconds: total_seconds,
        duration_hours: Math.round(total_seconds / 36) / 100,
        duration_formatted: roundToQuarterHour(total_seconds * 1000),
        activity_count,
        ...(type === 'app-use' && {
          applications: app_names ? app_names.split(',').sort() : []
        }),
        ...(type === 'task' && {
          task_title,
          task_notes
        })
      };
      
      return acc;
    }, {});

    res.json(projectData);
  } catch (error) {
    logger.error('Error fetching Timing data:', error);
    next(error);
  }
};

exports.addTimingEntry = async (req, res, next) => {
  try {
    const newEntry = req.body;
    const rawData = await fs.readFile(TIMING_DATA_PATH, 'utf8');
    const timingData = JSON.parse(rawData);

    timingData.push(newEntry);

    await fs.writeFile(TIMING_DATA_PATH, JSON.stringify(timingData, null, 2));

    res.status(201).json(newEntry);
  } catch (error) {
    logger.error('Error adding Timing entry:', error);
    next(error);
  }
};
