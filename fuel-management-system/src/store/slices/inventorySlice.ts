import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GasStore } from '../../types';

interface InventoryState {
  currentInventory: GasStore | null;
  inventoryHistory: GasStore[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  currentInventory: null,
  inventoryHistory: [],
  loading: false,
  error: null,
};

export const fetchCurrentInventoryAsync = createAsyncThunk(
  'inventory/fetchCurrentInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/gas-store/current');
      if (!response.ok) {
        throw new Error('Failed to fetch current inventory');
      }

      const data: GasStore = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch current inventory');
    }
  }
);

export const fetchInventoryHistoryAsync = createAsyncThunk(
  'inventory/fetchInventoryHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/gas-store');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory history');
      }

      const data: GasStore[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch inventory history');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentInventoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentInventoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInventory = action.payload;
      })
      .addCase(fetchCurrentInventoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInventoryHistoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryHistoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryHistory = action.payload;
      })
      .addCase(fetchInventoryHistoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer;