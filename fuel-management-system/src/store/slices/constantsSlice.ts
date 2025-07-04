import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Constant, ConstantType } from '../../types';

interface ConstantsState {
  constants: Constant[];
  constantsByType: Record<string, Constant[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ConstantsState = {
  constants: [],
  constantsByType: {},
  loading: false,
  error: null,
};

export const fetchConstantsAsync = createAsyncThunk(
  'constants/fetchConstants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/constants');
      if (!response.ok) {
        throw new Error('Failed to fetch constants');
      }

      const data: Constant[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch constants');
    }
  }
);

const constantsSlice = createSlice({
  name: 'constants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConstantsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConstantsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.constants = action.payload;
        
        // Group constants by type
        const grouped = action.payload.reduce((acc, constant) => {
          if (!constant.cnstType) return acc;
          if (!acc[constant.cnstType]) {
            acc[constant.cnstType] = [];
          }
          acc[constant.cnstType].push(constant);
          return acc;
        }, {} as Record<string, Constant[]>);
        
        state.constantsByType = grouped;
      })
      .addCase(fetchConstantsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = constantsSlice.actions;
export default constantsSlice.reducer;