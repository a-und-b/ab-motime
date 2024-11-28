const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { roundToQuarterHour } = require('../utils/timeUtils');
const timingDb = require('../services/timingDatabase');
const dotenv = require('dotenv');
dotenv.config();

const TIMING_DATA_PATH = path.join(__dirname, '../../timing.json');

function formatProjectName(path) {
  const [client, project] = path.split(' > ');
  return project ? `[${client}] ${project}` : path;
}

console.log('MINIMUM_DURATION_MINUTES:', process.env.MINIMUM_DURATION_MINUTES);
const MINIMUM_DURATION_MINUTES = parseInt(process.env.MINIMUM_DURATION_MINUTES) || 5;

exports.getTimingData = async (req, res, next) => {
  try {
    await timingDb.connect();
    const activities = await timingDb.getTimeEntries();

    // Group by date and project with duration filter
    const projectData = activities.reduce((acc, row) => {
      const { date, project_path, type, total_seconds, activity_count, app_names, task_title, task_notes } = row;
      
      // Filter out entries shorter than minimum duration
      if (total_seconds < (MINIMUM_DURATION_MINUTES * 60)) {
        return acc;
      }

      if (!acc[date]) {
        acc[date] = {};
      }
      
      const formattedProjectName = formatProjectName(project_path);
      
      // If entry already exists for this project on this date, accumulate the values
      if (acc[date][formattedProjectName]) {
        const existing = acc[date][formattedProjectName];
        
        // Accumulate durations
        existing.duration_seconds += total_seconds;
        existing.duration_hours = Math.round((existing.duration_seconds / 3600) * 100) / 100;
        existing.duration_minutes = Math.round(existing.duration_seconds / 60);
        existing.duration_formatted = roundToQuarterHour(existing.duration_seconds * 1000);
        
        // Accumulate activity count
        existing.activity_count += activity_count;
        
        // Merge applications if it's an app-use type
        if (type === 'app-use' && app_names) {
          const newApps = app_names.split(',');
          existing.applications = [...new Set([...existing.applications, ...newApps])].sort();
        }
        
        // For tasks, concatenate titles and notes
        if (type === 'task') {
          existing.task_title = existing.task_title ? `${existing.task_title}; ${task_title}` : task_title;
          if (task_notes) {
            existing.task_notes = existing.task_notes ? `${existing.task_notes}; ${task_notes}` : task_notes;
          }
        }
      } else {
        // Create new entry
        acc[date][formattedProjectName] = {
          type,
          duration_seconds: total_seconds,
          duration_hours: Math.round(total_seconds / 36) / 100,
          duration_minutes: Math.round(total_seconds / 60),
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
      }
      
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
