import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import vehiclesSlice from './slices/vehiclesSlice';
import generatorsSlice from './slices/generatorsSlice';
import fuelLogsSlice from './slices/fuelLogsSlice';
import invoicesSlice from './slices/invoicesSlice';
import inventorySlice from './slices/inventorySlice';
import constantsSlice from './slices/constantsSlice';
import stationsSlice from './slices/stationsSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    vehicles: vehiclesSlice,
    generators: generatorsSlice,
    fuelLogs: fuelLogsSlice,
    invoices: invoicesSlice,
    inventory: inventorySlice,
    constants: constantsSlice,
    stations: stationsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;