'use client';

import { useState, useEffect } from 'react';
import { Invoice, CreateInvoiceData, UpdateInvoiceData } from '../types/invoice';
import { Project } from '../types/project';
import { useCreateInvoice, useUpdateInvoice } from '../hooks/useInvoices';
import { useProjects } from '../hooks/useProjects';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  defaultProjectId?: string;
}

export default function AddInvoiceModal({
  isOpen,
  onClose,
  invoice,
  defaultProjectId,
}: AddInvoiceModalProps) {
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const { data: projects = [] } = useProjects();
  const isEdit = !!invoice;

  const [formData, setFormData] = useState<CreateInvoiceData>({
    projectId: defaultProjectId || '',
    clientName: '',
    amount: 0,
    dueDate: '',
    status: 'pending',
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        projectId: invoice.project_id || '',
        clientName: invoice.client_name,
        amount: invoice.amount,
        dueDate: invoice.due_date.split('T')[0],
        status: invoice.status,
      });
    } else {
      setFormData({
        projectId: defaultProjectId || '',
        clientName: '',
        amount: 0,
        dueDate: '',
        status: 'pending',
      });
    }
  }, [invoice, defaultProjectId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && invoice) {
        await updateInvoice.mutateAsync({
          id: invoice.id,
          data: formData as UpdateInvoiceData,
        });
      } else {
        await createInvoice.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project (Optional)
            </label>
            <select
              value={formData.projectId || ''}
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">No Project</option>
              {projects.map((project: Project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'paid' | 'pending' | 'overdue',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createInvoice.isPending || updateInvoice.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createInvoice.isPending || updateInvoice.isPending
                ? 'Saving...'
                : isEdit
                ? 'Update'
                : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

