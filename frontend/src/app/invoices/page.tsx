'use client';

import { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import { useInvoices } from '../../hooks/useInvoices';
import InvoiceCard from '../../components/InvoiceCard';
import AddInvoiceModal from '../../components/AddInvoiceModal';
import { Invoice } from '../../types/invoice';
import Link from 'next/link';

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: invoices = [], isLoading } = useInvoices(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );
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

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Invoices
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your invoices and track payments
              </p>
            </div>
            <Link
              href="/invoices/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              + Add New Invoice
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === 'overdue'
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Overdue
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No invoices found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
              </p>
              <Link
                href="/invoices/new"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Create Invoice
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} onEdit={handleEdit} />
              ))}
            </div>
          )}

          <AddInvoiceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            invoice={editingInvoice}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

