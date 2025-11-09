'use client';

import { Invoice } from '../types/invoice';
import { useDeleteInvoice, useUpdateInvoice } from '../hooks/useInvoices';
import { format } from 'date-fns';

interface InvoiceCardProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
}

export default function InvoiceCard({ invoice, onEdit }: InvoiceCardProps) {
  const deleteInvoice = useDeleteInvoice();
  const updateInvoice = useUpdateInvoice();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice.mutateAsync(invoice.id);
    }
  };

  const handleStatusChange = async (newStatus: 'paid' | 'pending' | 'overdue') => {
    await updateInvoice.mutateAsync({
      id: invoice.id,
      data: { status: newStatus },
    });
  };

  const statusColors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {formatCurrency(invoice.amount)}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Client: {invoice.client_name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[invoice.status]
          }`}
        >
          {invoice.status}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <select
          value={invoice.status}
          onChange={(e) =>
            handleStatusChange(e.target.value as 'paid' | 'pending' | 'overdue')
          }
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(invoice)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteInvoice.isPending}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {deleteInvoice.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

