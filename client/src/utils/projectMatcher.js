export function extractProjectParts(projectName) {
  // Already matches our new format
  const match = projectName.match(/^\[(\w+)\]\s(.+)/);
  if (match) {
    return { prefix: match[1], name: match[2] };
  }
  return null;
}

export function findMatchingProject(timingProject, mocoProjects) {
  if (!timingProject || !mocoProjects) return null;

  const sanitizedTimingName = sanitizeProjectName(timingProject);

  return mocoProjects.find(mocoProject => {
    const sanitizedMocoName = sanitizeProjectName(mocoProject.name);
    return sanitizedTimingName.includes(sanitizedMocoName) || 
           sanitizedMocoName.includes(sanitizedTimingName);
  });
}

export function extractTaskName(timingProjectName) {
  const parts = timingProjectName.split('▸');
  return parts[parts.length - 1].trim();
}

export function findMatchingTask(timingTask, mocoTasks) {
  if (!timingTask || !mocoTasks) return null;

  const sanitizedTimingTask = sanitizeProjectName(timingTask);

  return mocoTasks.find(mocoTask => {
    const sanitizedMocoTask = sanitizeProjectName(mocoTask.name);
    return sanitizedTimingTask.includes(sanitizedMocoTask) || 
           sanitizedMocoTask.includes(sanitizedTimingTask);
  });
}

function sanitizeProjectName(name) {
  // Remove special characters and normalize spaces
  return name
    .replace(/[\[\]]/g, '') // Remove square brackets
    .replace(/&/g, 'and')   // Replace & with 'and'
    .replace(/[^\w\s-]/g, '') // Remove other special characters
    .toLowerCase()
    .trim();
}
