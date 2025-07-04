import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle, VehicleFilters, PaginatedResponse, CreateVehicleDTO, UpdateVehicleDTO } from '../../types';

interface VehiclesState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  filters: VehicleFilters;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const initialState: VehiclesState = {
  vehicles: [],
  selectedVehicle: null,
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

export const fetchVehiclesAsync = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (filters: VehicleFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/vehicles?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data: PaginatedResponse<Vehicle> = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vehicles');
    }
  }
);

export const fetchVehicleByIdAsync = createAsyncThunk(
  'vehicles/fetchVehicleById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle');
      }

      const data: Vehicle = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vehicle');
    }
  }
);

export const createVehicleAsync = createAsyncThunk(
  'vehicles/createVehicle',
  async (vehicleData: CreateVehicleDTO, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create vehicle');
      }

      const data: Vehicle = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create vehicle');
    }
  }
);

export const updateVehicleAsync = createAsyncThunk(
  'vehicles/updateVehicle',
  async (vehicleData: UpdateVehicleDTO, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleData.oid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error('Failed to update vehicle');
      }

      const data: Vehicle = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update vehicle');
    }
  }
);

export const deleteVehicleAsync = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete vehicle');
    }
  }
);

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<VehicleFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { page: 1, pageSize: 10 };
    },
    setSelectedVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.selectedVehicle = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehiclesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehiclesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchVehiclesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchVehicleByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehicle = action.payload;
      })
      .addCase(fetchVehicleByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVehicleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.push(action.payload);
      })
      .addCase(createVehicleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateVehicleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicleAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vehicles.findIndex(v => v.oid === action.payload.oid);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
        if (state.selectedVehicle?.oid === action.payload.oid) {
          state.selectedVehicle = action.payload;
        }
      })
      .addCase(updateVehicleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteVehicleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = state.vehicles.filter(v => v.oid !== action.payload);
        if (state.selectedVehicle?.oid === action.payload) {
          state.selectedVehicle = null;
        }
      })
      .addCase(deleteVehicleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setSelectedVehicle, clearError } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;