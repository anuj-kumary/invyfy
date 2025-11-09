'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import Navigation from '../../../../components/Navigation';
import { useProject } from '../../../../hooks/useProjects';
import { useInvoices } from '../../../../hooks/useInvoices';
import AddInvoiceModal from '../../../../components/AddInvoiceModal';
import InvoiceCard from '../../../../components/InvoiceCard';
import { Invoice } from '../../../../types/invoice';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices({
    projectId,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  const handleAddNew = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  if (projectLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Project not found</p>
            <Link
              href="/projects"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4 inline-block"
          >
            ← Back to Projects
          </Link>

          {/* Project Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Client: {project.client_name}
                </p>
                {project.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  statusColors[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Start Date:
                </span>{' '}
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(project.start_date), 'MMM dd, yyyy')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Due Date:
                </span>{' '}
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(project.due_date), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Invoices Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Invoices
              </h2>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                + Add Invoice
              </button>
            </div>

            {invoicesLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading invoices...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No invoices for this project yet.
                </p>
                <button
                  onClick={handleAddNew}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Invoice
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invoices.map((invoice) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>

          <AddInvoiceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            invoice={editingInvoice}
            defaultProjectId={projectId}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

