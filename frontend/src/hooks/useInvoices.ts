'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InvoiceService } from '../services/invoiceService';
import { Invoice, CreateInvoiceData, UpdateInvoiceData } from '../types/invoice';
import toast from 'react-hot-toast';

interface UseInvoicesParams {
  status?: string;
  projectId?: string;
}

export const useInvoices = (params?: UseInvoicesParams) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const response = await InvoiceService.getAll(params);
      return response.data.invoices;
    },
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const response = await InvoiceService.getById(id);
      return response.data.invoice;
    },
    enabled: !!id,
  });
};

export const useInvoiceStats = () => {
  return useQuery({
    queryKey: ['invoiceStats'],
    queryFn: async () => {
      const response = await InvoiceService.getStats();
      return response.data.stats;
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceData) => InvoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoiceStats'] });
      toast.success('Invoice created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create invoice');
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceData }) =>
      InvoiceService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoiceStats'] });
      toast.success('Invoice updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update invoice');
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => InvoiceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoiceStats'] });
      toast.success('Invoice deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete invoice');
    },
  });
};

