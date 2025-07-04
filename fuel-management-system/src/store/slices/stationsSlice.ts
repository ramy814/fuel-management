import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Station } from '../../types';

interface StationsState {
  stations: Station[];
  loading: boolean;
  error: string | null;
}

const initialState: StationsState = {
  stations: [],
  loading: false,
  error: null,
};

export const fetchStationsAsync = createAsyncThunk(
  'stations/fetchStations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/stations');
      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }

      const data: Station[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch stations');
    }
  }
);

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchStationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = stationsSlice.actions;
export default stationsSlice.reducer;