import { pool } from '../config/database';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  project_id: string | null;
  client_name: string;
  amount: number;
  due_date: Date;
  status: InvoiceStatus;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInvoiceData {
  projectId?: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status?: InvoiceStatus;
}

export interface UpdateInvoiceData {
  projectId?: string | null;
  clientName?: string;
  amount?: number;
  dueDate?: string;
  status?: InvoiceStatus;
}

export class InvoiceModel {
  // Create a new invoice
  static async create(userId: string, invoiceData: CreateInvoiceData): Promise<Invoice> {
    const { projectId, clientName, amount, dueDate, status = 'pending' } = invoiceData;
    
    const query = `
      INSERT INTO invoices (project_id, client_name, amount, due_date, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [projectId || null, clientName, amount, dueDate, status, userId];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }

  // Get all invoices for a user
  static async findByUserId(userId: string): Promise<Invoice[]> {
    const query = `
      SELECT * FROM invoices 
      WHERE created_by = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    
    return result.rows;
  }

  // Get invoices by project ID
  static async findByProjectId(projectId: string, userId: string): Promise<Invoice[]> {
    const query = `
      SELECT * FROM invoices 
      WHERE project_id = $1 AND created_by = $2 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [projectId, userId]);
    
    return result.rows;
  }

  // Get invoice by ID (only if owned by user)
  static async findById(id: string, userId: string): Promise<Invoice | null> {
    const query = `
      SELECT * FROM invoices 
      WHERE id = $1 AND created_by = $2
    `;
    const result = await pool.query(query, [id, userId]);
    
    return result.rows[0] || null;
  }

  // Update invoice
  static async update(id: string, userId: string, invoiceData: UpdateInvoiceData): Promise<Invoice | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (invoiceData.projectId !== undefined) {
      updates.push(`project_id = $${paramCount++}`);
      values.push(invoiceData.projectId);
    }
    if (invoiceData.clientName !== undefined) {
      updates.push(`client_name = $${paramCount++}`);
      values.push(invoiceData.clientName);
    }
    if (invoiceData.amount !== undefined) {
      updates.push(`amount = $${paramCount++}`);
      values.push(invoiceData.amount);
    }
    if (invoiceData.dueDate !== undefined) {
      updates.push(`due_date = $${paramCount++}`);
      values.push(invoiceData.dueDate);
    }
    if (invoiceData.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(invoiceData.status);
    }

    if (updates.length === 0) {
      return await this.findById(id, userId);
    }

    values.push(id, userId);
    const query = `
      UPDATE invoices 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND created_by = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete invoice
  static async delete(id: string, userId: string): Promise<boolean> {
    const query = `
      DELETE FROM invoices 
      WHERE id = $1 AND created_by = $2
    `;
    const result = await pool.query(query, [id, userId]);
    
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Get invoice statistics for a user
  static async getStats(userId: string): Promise<{
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalRevenue: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'paid') as paid,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'overdue') as overdue,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as total_revenue
      FROM invoices 
      WHERE created_by = $1
    `;
    const result = await pool.query(query, [userId]);
    
    const row = result.rows[0];
    return {
      total: parseInt(row.total) || 0,
      paid: parseInt(row.paid) || 0,
      pending: parseInt(row.pending) || 0,
      overdue: parseInt(row.overdue) || 0,
      totalRevenue: parseFloat(row.total_revenue) || 0,
    };
  }
}

