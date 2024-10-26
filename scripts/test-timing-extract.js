const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.TIMING_DB_PATH;
const daysBack = parseInt(process.env.TIMING_DAYS_BACK) || 30;
const outputPath = path.join(__dirname, '..', 'data', 'timing-extract.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function formatProjectName(path) {
  const [client, project] = path.split(' > ');
  return project ? `[${client}] ${project}` : path;
}

function getTimingData() {
  const db = new Database(dbPath, { 
    readonly: true,
    fileMustExist: true
  });
  
  try {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysBack);
    
    const startTimestamp = pastDate.getTime() / 1000;
    const endTimestamp = now.getTime() / 1000;

    // Query for app activities
    const appQuery = `
      WITH RECURSIVE ProjectHierarchy AS (
        SELECT 
          id,
          title,
          parentID,
          0 as level,
          title as full_path
        FROM Project
        WHERE parentID IS NULL
        
        UNION ALL
        
        SELECT 
          p.id,
          p.title,
          p.parentID,
          ph.level + 1,
          ph.full_path || ' > ' || p.title as full_path
        FROM Project p
        JOIN ProjectHierarchy ph ON p.parentID = ph.id
      )
      SELECT 
        ph.id as project_id,
        ph.full_path as project_path,
        date(aa.startDate, 'unixepoch', 'localtime') as date,
        'app-use' as type,
        COUNT(*) as activity_count,
        SUM(aa.endDate - aa.startDate) as total_seconds,
        GROUP_CONCAT(DISTINCT app.title) as app_names,
        NULL as task_title,
        NULL as task_notes
      FROM ProjectHierarchy ph
      JOIN AppActivity aa ON aa.projectID = ph.id
      JOIN Application app ON app.id = aa.applicationID
      WHERE 
        aa.isDeleted = 0
        AND aa.startDate >= ?
        AND aa.startDate <= ?
      GROUP BY 
        ph.id,
        ph.full_path,
        date(aa.startDate, 'unixepoch', 'localtime')
      
      UNION ALL
      
      SELECT 
        p.id as project_id,
        CASE 
          WHEN pp.title IS NOT NULL THEN pp.title || ' > ' || p.title
          ELSE p.title
        END as project_path,
        date(ta.startDate, 'unixepoch', 'localtime') as date,
        'task' as type,
        1 as activity_count,
        (ta.endDate - ta.startDate) as total_seconds,
        NULL as app_names,
        ta.title as task_title,
        ta.notes as task_notes
      FROM TaskActivity ta
      JOIN Project p ON p.id = ta.projectID
      LEFT JOIN Project pp ON p.parentID = pp.id
      WHERE 
        ta.isDeleted = 0
        AND ta.startDate >= ?
        AND ta.startDate <= ?
      
      ORDER BY 
        date DESC,
        project_path,
        type
    `;

    const activities = db.prepare(appQuery).all(
      startTimestamp, 
      endTimestamp,
      startTimestamp,
      endTimestamp
    );

    // Transform into date-based structure with formatted project names
    const projectData = activities.reduce((acc, row) => {
      const { 
        date, 
        project_path, 
        type,
        total_seconds, 
        activity_count, 
        app_names,
        task_title,
        task_notes
      } = row;
      
      if (!acc[date]) {
        acc[date] = {};
      }
      
      const formattedProjectName = formatProjectName(project_path);
      
      acc[date][formattedProjectName] = {
        type,
        duration_seconds: total_seconds,
        duration_hours: Math.round(total_seconds / 36) / 100,
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

    fs.writeFileSync(outputPath, JSON.stringify(projectData, null, 2), 'utf8');
    console.log(`Data written to: ${outputPath}`);
    
    return projectData;

  } finally {
    db.close();
  }
}

try {
  getTimingData();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
