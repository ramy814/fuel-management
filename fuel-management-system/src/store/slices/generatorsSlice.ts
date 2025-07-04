import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Generator, CreateGeneratorDTO, UpdateGeneratorDTO } from '../../types';

interface GeneratorsState {
  generators: Generator[];
  selectedGenerator: Generator | null;
  loading: boolean;
  error: string | null;
}

const initialState: GeneratorsState = {
  generators: [],
  selectedGenerator: null,
  loading: false,
  error: null,
};

export const fetchGeneratorsAsync = createAsyncThunk(
  'generators/fetchGenerators',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/generators');
      if (!response.ok) {
        throw new Error('Failed to fetch generators');
      }

      const data: Generator[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch generators');
    }
  }
);

export const fetchGeneratorByIdAsync = createAsyncThunk(
  'generators/fetchGeneratorById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/generators/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch generator');
      }

      const data: Generator = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch generator');
    }
  }
);

export const createGeneratorAsync = createAsyncThunk(
  'generators/createGenerator',
  async (generatorData: CreateGeneratorDTO, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/generators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatorData),
      });

      if (!response.ok) {
        throw new Error('Failed to create generator');
      }

      const data: Generator = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create generator');
    }
  }
);

export const updateGeneratorAsync = createAsyncThunk(
  'generators/updateGenerator',
  async (generatorData: UpdateGeneratorDTO, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/generators/${generatorData.oid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatorData),
      });

      if (!response.ok) {
        throw new Error('Failed to update generator');
      }

      const data: Generator = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update generator');
    }
  }
);

export const deleteGeneratorAsync = createAsyncThunk(
  'generators/deleteGenerator',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/generators/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete generator');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete generator');
    }
  }
);

const generatorsSlice = createSlice({
  name: 'generators',
  initialState,
  reducers: {
    setSelectedGenerator: (state, action: PayloadAction<Generator | null>) => {
      state.selectedGenerator = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneratorsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneratorsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.generators = action.payload;
      })
      .addCase(fetchGeneratorsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGeneratorByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneratorByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGenerator = action.payload;
      })
      .addCase(fetchGeneratorByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGeneratorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGeneratorAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.generators.push(action.payload);
      })
      .addCase(createGeneratorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGeneratorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGeneratorAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.generators.findIndex(g => g.oid === action.payload.oid);
        if (index !== -1) {
          state.generators[index] = action.payload;
        }
        if (state.selectedGenerator?.oid === action.payload.oid) {
          state.selectedGenerator = action.payload;
        }
      })
      .addCase(updateGeneratorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGeneratorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGeneratorAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.generators = state.generators.filter(g => g.oid !== action.payload);
        if (state.selectedGenerator?.oid === action.payload) {
          state.selectedGenerator = null;
        }
      })
      .addCase(deleteGeneratorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedGenerator, clearError } = generatorsSlice.actions;
export default generatorsSlice.reducer;