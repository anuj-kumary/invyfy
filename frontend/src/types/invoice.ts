export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  project_id: string | null;
  client_name: string;
  amount: number;
  due_date: string;
  status: InvoiceStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  projectId?: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status?: InvoiceStatus;
}

export interface UpdateInvoiceData {
  projectId?: string | null;
  clientName?: string;
  amount?: number;
  dueDate?: string;
  status?: InvoiceStatus;
}

export interface InvoiceResponse {
  success: boolean;
  data: {
    invoice: Invoice;
  };
  message?: string;
}

export interface InvoicesResponse {
  success: boolean;
  data: {
    invoices: Invoice[];
  };
}

export interface InvoiceStats {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  totalRevenue: number;
}

export interface InvoiceStatsResponse {
  success: boolean;
  data: {
    stats: InvoiceStats;
  };
}

