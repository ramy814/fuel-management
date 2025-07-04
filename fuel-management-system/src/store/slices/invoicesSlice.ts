import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GasBill, GasBillFilters, PaginatedResponse, CreateGasBillDTO, UpdateGasBillDTO } from '../../types';

interface InvoicesState {
  invoices: GasBill[];
  selectedInvoice: GasBill | null;
  loading: boolean;
  error: string | null;
  filters: GasBillFilters;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const initialState: InvoicesState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 10,
  },
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  },
};

export const fetchInvoicesAsync = createAsyncThunk(
  'invoices/fetchInvoices',
  async (filters: GasBillFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/gas-bills?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data: PaginatedResponse<GasBill> = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch invoices');
    }
  }
);

export const createInvoiceAsync = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData: CreateGasBillDTO, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/gas-bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const data: GasBill = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create invoice');
    }
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<GasBillFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { page: 1, pageSize: 10 };
    },
    setSelectedInvoice: (state, action: PayloadAction<GasBill | null>) => {
      state.selectedInvoice = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchInvoicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createInvoiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setSelectedInvoice, clearError } = invoicesSlice.actions;
export default invoicesSlice.reducer;