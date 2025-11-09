import { Response } from 'express';
import { z } from 'zod';
import { InvoiceModel, CreateInvoiceData, UpdateInvoiceData } from '../models/Invoice';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const createInvoiceSchema = z.object({
  projectId: z.string().uuid('Invalid project ID format').optional(),
  clientName: z.string().min(1, 'Client name is required').max(255, 'Client name must be less than 255 characters'),
  amount: z.number().positive('Amount must be positive').max(999999999.99, 'Amount is too large'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  status: z.enum(['paid', 'pending', 'overdue']).optional(),
});

const updateInvoiceSchema = z.object({
  projectId: z.string().uuid().nullable().optional(),
  clientName: z.string().min(1).max(255).optional(),
  amount: z.number().positive().max(999999999.99).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['paid', 'pending', 'overdue']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export class InvoiceController {
  // Get all invoices for the logged-in user
  static async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const { status, projectId } = req.query;
      let invoices;

      if (projectId) {
        invoices = await InvoiceModel.findByProjectId(projectId as string, req.user.id);
      } else {
        invoices = await InvoiceModel.findByUserId(req.user.id);
      }

      // Filter by status if provided
      if (status && ['paid', 'pending', 'overdue'].includes(status as string)) {
        invoices = invoices.filter((invoice) => invoice.status === status);
      }

      res.json({
        success: true,
        data: { invoices },
      });
    } catch (error) {
      console.error('Get all invoices error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching invoices',
      });
    }
  }

  // Get a single invoice by ID
  static async getById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const invoice = await InvoiceModel.findById(id, req.user.id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found',
        });
      }

      res.json({
        success: true,
        data: { invoice },
      });
    } catch (error) {
      console.error('Get invoice by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching invoice',
      });
    }
  }

  // Create a new invoice
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Validate request body
      const validationResult = createInvoiceSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors,
        });
      }

      const invoiceData: CreateInvoiceData = validationResult.data;
      const invoice = await InvoiceModel.create(req.user.id, invoiceData);

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: { invoice },
      });
    } catch (error) {
      console.error('Create invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating invoice',
      });
    }
  }

  // Update an invoice
  static async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;

      // Validate request body
      const validationResult = updateInvoiceSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors,
        });
      }

      const invoiceData: UpdateInvoiceData = validationResult.data;
      const invoice = await InvoiceModel.update(id, req.user.id, invoiceData);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found',
        });
      }

      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: { invoice },
      });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating invoice',
      });
    }
  }

  // Delete an invoice
  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const deleted = await InvoiceModel.delete(id, req.user.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found',
        });
      }

      res.json({
        success: true,
        message: 'Invoice deleted successfully',
      });
    } catch (error) {
      console.error('Delete invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting invoice',
      });
    }
  }

  // Get invoice statistics
  static async getStats(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const stats = await InvoiceModel.getStats(req.user.id);

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      console.error('Get invoice stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching statistics',
      });
    }
  }
}

