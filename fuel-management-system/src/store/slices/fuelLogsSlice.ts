import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FuelLog, FuelLogFilters, PaginatedResponse, CreateFuelLogDTO, UpdateFuelLogDTO } from '../../types';

interface FuelLogsState {
  fuelLogs: FuelLog[];
  selectedFuelLog: FuelLog | null;
  loading: boolean;
  error: string | null;
  filters: FuelLogFilters;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const initialState: FuelLogsState = {
  fuelLogs: [],
  selectedFuelLog: null,
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

export const fetchFuelLogsAsync = createAsyncThunk(
  'fuelLogs/fetchFuelLogs',
  async (filters: FuelLogFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/fuel-logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fuel logs');
      }

      const data: PaginatedResponse<FuelLog> = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch fuel logs');
    }
  }
);

export const createFuelLogAsync = createAsyncThunk(
  'fuelLogs/createFuelLog',
  async (fuelLogData: CreateFuelLogDTO, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/fuel-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fuelLogData),
      });

      if (!response.ok) {
        throw new Error('Failed to create fuel log');
      }

      const data: FuelLog = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create fuel log');
    }
  }
);

export const updateFuelLogAsync = createAsyncThunk(
  'fuelLogs/updateFuelLog',
  async (fuelLogData: UpdateFuelLogDTO, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/fuel-logs/${fuelLogData.oid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fuelLogData),
      });

      if (!response.ok) {
        throw new Error('Failed to update fuel log');
      }

      const data: FuelLog = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update fuel log');
    }
  }
);

export const deleteFuelLogAsync = createAsyncThunk(
  'fuelLogs/deleteFuelLog',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/fuel-logs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete fuel log');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete fuel log');
    }
  }
);

const fuelLogsSlice = createSlice({
  name: 'fuelLogs',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FuelLogFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { page: 1, pageSize: 10 };
    },
    setSelectedFuelLog: (state, action: PayloadAction<FuelLog | null>) => {
      state.selectedFuelLog = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelLogsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuelLogsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelLogs = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchFuelLogsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createFuelLogAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFuelLogAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelLogs.unshift(action.payload);
      })
      .addCase(createFuelLogAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFuelLogAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFuelLogAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.fuelLogs.findIndex(f => f.oid === action.payload.oid);
        if (index !== -1) {
          state.fuelLogs[index] = action.payload;
        }
        if (state.selectedFuelLog?.oid === action.payload.oid) {
          state.selectedFuelLog = action.payload;
        }
      })
      .addCase(updateFuelLogAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFuelLogAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFuelLogAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelLogs = state.fuelLogs.filter(f => f.oid !== action.payload);
        if (state.selectedFuelLog?.oid === action.payload) {
          state.selectedFuelLog = null;
        }
      })
      .addCase(deleteFuelLogAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setSelectedFuelLog, clearError } = fuelLogsSlice.actions;
export default fuelLogsSlice.reducer;