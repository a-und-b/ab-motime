export function extractProjectParts(projectName) {
  const timingMatch = projectName.match(/^(\w+)\s▸\s(.+?)(?:\s▸|$)/);
  const mocoMatch = projectName.match(/^\[(\w+)\]\s(.+)/);

  if (timingMatch) {
    return { prefix: timingMatch[1], name: timingMatch[2] };
  } else if (mocoMatch) {
    return { prefix: mocoMatch[1], name: mocoMatch[2] };
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

export function findMatchingTask(timingProjectName, mocoTasks) {
  const taskName = extractTaskName(timingProjectName);
  return mocoTasks.find(task => 
    task.name.toLowerCase() === taskName.toLowerCase()
  );
}
