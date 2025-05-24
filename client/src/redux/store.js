import { configureStore } from '@reduxjs/toolkit';
import apartmentReducer from './slices/apartmentSlice';

export const store = configureStore({
  reducer: {
    apartments: apartmentReducer
  }
});

export default store;