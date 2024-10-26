const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

class TimingDatabaseService {
  constructor() {
    this.db = null;
  }

  async connect() {
    if (this.db) return;
    
    const dbPath = process.env.TIMING_DB_PATH.replace(/\\/g, '');
    
    try {
      this.db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READONLY
      });
      console.log('Connected to database:', dbPath);
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async getTimeEntries(daysBack = 30) {
    const cutoffDate = (Date.now() / 1000) - (daysBack * 24 * 60 * 60);
    
    const query = `
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
        AND aa.startDate > ?
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
        AND ta.startDate > ?
      ORDER BY 
        date DESC,
        project_path,
        type
    `;

    return await this.db.all(query, [cutoffDate, cutoffDate]);
  }

  async getApplicationActivities() {
    return await this.db.all(`
      SELECT 
        aa.*,
        t.stringValue as title,
        p.stringValue as path,
        proj.title as projectName
      FROM AppActivityWithStrings aa
      LEFT JOIN Application a ON aa.applicationID = a.id
      LEFT JOIN Project proj ON aa.projectID = proj.id
      WHERE aa.isDeleted = 0
      ORDER BY aa.startDate DESC
    `);
  }
}

module.exports = new TimingDatabaseService();
