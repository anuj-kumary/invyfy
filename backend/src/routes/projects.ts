import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects
router.get('/', ProjectController.getAll);

// Get a single project
router.get('/:id', ProjectController.getById);

// Create a new project
router.post('/', ProjectController.create);

// Update a project
router.put('/:id', ProjectController.update);

// Delete a project
router.delete('/:id', ProjectController.delete);

export default router;

