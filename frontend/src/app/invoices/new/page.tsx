'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import Navigation from '../../../components/Navigation';
import AddInvoiceModal from '../../../components/AddInvoiceModal';
import { useState } from 'react';

export default function NewInvoicePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/invoices');
  };

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AddInvoiceModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

