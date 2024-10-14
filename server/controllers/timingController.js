const fs = require('fs').promises;
const path = require('path');
const timeUtils = require('../utils/timeUtils');

// Funktion zum Einlesen und Parsen der timing.json Datei
async function parseTimingJson() {
  try {
    const filePath = path.join(__dirname, '..', '..', 'timing.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading timing.json:', error);
    throw error;
  }
}

// Funktion zum Verarbeiten der Timing-Daten
function processTimingData(data) {
  return data.map(entry => {
    const [customerCode, projectName, task] = entry.project.split(' / ');
    const duration = timeUtils.roundToQuarterHour(entry.duration);
    
    return {
      date: new Date(entry.startDate).toISOString().split('T')[0],
      customerCode,
      projectName,
      task,
      description: entry.activityTitle,
      duration,
      originalDuration: entry.duration
    };
  });
}

exports.getTimingData = async (req, res) => {
  try {
    const rawData = await parseTimingJson();
    const processedData = processTimingData(rawData);
    res.json(processedData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching timing data' });
  }
};

exports.addTimingEntry = (req, res) => {
  // Diese Funktion wird vorerst nicht implementiert, da wir die Daten aus der JSON-Datei lesen
  res.status(501).json({ message: 'Not implemented' });
};
