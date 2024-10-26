function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end - start;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

function roundToQuarterHour(durationInMs) {
  const minutes = durationInMs / 60000;
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

module.exports = {
  calculateDuration,
  roundToQuarterHour
};
