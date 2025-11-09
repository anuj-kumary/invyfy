import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get invoice statistics
router.get('/stats', InvoiceController.getStats);

// Get all invoices
router.get('/', InvoiceController.getAll);

// Get a single invoice
router.get('/:id', InvoiceController.getById);

// Create a new invoice
router.post('/', InvoiceController.create);

// Update an invoice
router.put('/:id', InvoiceController.update);

// Delete an invoice
router.delete('/:id', InvoiceController.delete);

export default router;

