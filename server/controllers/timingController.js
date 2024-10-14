const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { calculateDuration, roundToQuarterHour } = require('../utils/timeUtils');

const TIMING_DATA_PATH = path.join(__dirname, '../../timing.json');

exports.getTimingData = async (req, res, next) => {
  try {
    const rawData = await fs.readFile(TIMING_DATA_PATH, 'utf8');
    const timingData = JSON.parse(rawData);

    const processedData = timingData.map(entry => ({
      id: entry.id,
      projectName: entry.project,
      task: entry.activityTitle,
      description: entry.activityTitle,
      startDate: entry.startDate,
      endDate: entry.endDate,
      duration: calculateDuration(entry.startDate, entry.endDate),
      roundedDuration: roundToQuarterHour(new Date(entry.endDate) - new Date(entry.startDate))
    }));

    res.json(processedData);
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
