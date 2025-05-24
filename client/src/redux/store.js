import { configureStore } from '@reduxjs/toolkit';
import apartmentReducer from '../features/apartments/apartmentSlice';

export const store = configureStore({
  reducer: {
    apartments: apartmentReducer
  }
});

export default store;