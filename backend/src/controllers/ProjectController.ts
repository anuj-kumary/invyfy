import { Response } from 'express';
import { z } from 'zod';
import { ProjectModel, CreateProjectData, UpdateProjectData } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  clientName: z.string().min(1, 'Client name is required').max(255, 'Client name must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  status: z.enum(['active', 'completed']).optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  clientName: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['active', 'completed']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export class ProjectController {
  // Get all projects for the logged-in user
  static async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const projects = await ProjectModel.findByUserId(req.user.id);

      res.json({
        success: true,
        data: { projects },
      });
    } catch (error) {
      console.error('Get all projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching projects',
      });
    }
  }

  // Get a single project by ID
  static async getById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const project = await ProjectModel.findById(id, req.user.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      res.json({
        success: true,
        data: { project },
      });
    } catch (error) {
      console.error('Get project by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching project',
      });
    }
  }

  // Create a new project
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Validate request body
      const validationResult = createProjectSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors,
        });
      }

      const projectData: CreateProjectData = validationResult.data;
      const project = await ProjectModel.create(req.user.id, projectData);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: { project },
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating project',
      });
    }
  }

  // Update a project
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
      const validationResult = updateProjectSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors,
        });
      }

      const projectData: UpdateProjectData = validationResult.data;
      const project = await ProjectModel.update(id, req.user.id, projectData);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: { project },
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating project',
      });
    }
  }

  // Delete a project
  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const { id } = req.params;
      const deleted = await ProjectModel.delete(id, req.user.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      res.json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting project',
      });
    }
  }
}

