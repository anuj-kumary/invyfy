import { pool } from '../config/database';

export type ProjectStatus = 'active' | 'completed';

export interface Project {
  id: string;
  name: string;
  client_name: string;
  description: string | null;
  start_date: Date;
  due_date: Date;
  status: ProjectStatus;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectData {
  name: string;
  clientName: string;
  description?: string;
  startDate: string;
  dueDate: string;
  status?: ProjectStatus;
}

export interface UpdateProjectData {
  name?: string;
  clientName?: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  status?: ProjectStatus;
}

export class ProjectModel {
  // Create a new project
  static async create(userId: string, projectData: CreateProjectData): Promise<Project> {
    const { name, clientName, description, startDate, dueDate, status = 'active' } = projectData;
    
    const query = `
      INSERT INTO projects (name, client_name, description, start_date, due_date, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [name, clientName, description || null, startDate, dueDate, status, userId];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }

  // Get all projects for a user
  static async findByUserId(userId: string): Promise<Project[]> {
    const query = `
      SELECT * FROM projects 
      WHERE created_by = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    
    return result.rows;
  }

  // Get project by ID (only if owned by user)
  static async findById(id: string, userId: string): Promise<Project | null> {
    const query = `
      SELECT * FROM projects 
      WHERE id = $1 AND created_by = $2
    `;
    const result = await pool.query(query, [id, userId]);
    
    return result.rows[0] || null;
  }

  // Update project
  static async update(id: string, userId: string, projectData: UpdateProjectData): Promise<Project | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (projectData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(projectData.name);
    }
    if (projectData.clientName !== undefined) {
      updates.push(`client_name = $${paramCount++}`);
      values.push(projectData.clientName);
    }
    if (projectData.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(projectData.description);
    }
    if (projectData.startDate !== undefined) {
      updates.push(`start_date = $${paramCount++}`);
      values.push(projectData.startDate);
    }
    if (projectData.dueDate !== undefined) {
      updates.push(`due_date = $${paramCount++}`);
      values.push(projectData.dueDate);
    }
    if (projectData.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(projectData.status);
    }

    if (updates.length === 0) {
      return await this.findById(id, userId);
    }

    values.push(id, userId);
    const query = `
      UPDATE projects 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND created_by = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete project
  static async delete(id: string, userId: string): Promise<boolean> {
    const query = `
      DELETE FROM projects 
      WHERE id = $1 AND created_by = $2
    `;
    const result = await pool.query(query, [id, userId]);
    
    return result.rowCount !== null && result.rowCount > 0;
  }
}

