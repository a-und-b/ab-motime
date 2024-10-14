function calculateDuration(startTime, endTime) {
  // Convert times to Date objects
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Calculate the difference in milliseconds
  const diff = end - start;

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
}

function roundToQuarterHour(duration) {
  const minutes = duration / 60;
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

module.exports = {
  calculateDuration,
  roundToQuarterHour
};
