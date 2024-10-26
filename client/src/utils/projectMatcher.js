export function extractProjectParts(projectName) {
  // Already matches our new format
  const match = projectName.match(/^\[(\w+)\]\s(.+)/);
  if (match) {
    return { prefix: match[1], name: match[2] };
  }
  return null;
}

export function findMatchingProject(timingProjectName, mocoProjects) {
  const timingParts = extractProjectParts(timingProjectName);
  if (!timingParts) return null;

  return mocoProjects.find(project => {
    const mocoParts = extractProjectParts(project.name);
    if (!mocoParts) return false;

    return timingParts.prefix === mocoParts.prefix &&
           timingParts.name.toLowerCase().includes(mocoParts.name.toLowerCase());
  });
}

export function extractTaskName(timingProjectName) {
  const parts = timingProjectName.split('▸');
  return parts[parts.length - 1].trim();
}

export function findMatchingTask(entry, mocoTasks) {
  if (!mocoTasks || !mocoTasks.length) return null;
  
  if (entry.type === 'task' && entry.task_title) {
    // For manual tasks, try to match by task title
    const exactMatch = mocoTasks.find(task => 
      task.name.toLowerCase() === entry.task_title.toLowerCase()
    );
    if (exactMatch) return exactMatch;
  }
  
  // Default to "Development" or similar task if available
  return mocoTasks.find(task => 
    task.name.toLowerCase().includes('development') ||
    task.name.toLowerCase().includes('consulting')
  );
}
