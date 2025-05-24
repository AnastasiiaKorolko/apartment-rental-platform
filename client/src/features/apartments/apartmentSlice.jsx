import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchApartments = createAsyncThunk(
  'apartments/fetchApartments',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.getApartments(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchApartmentById = createAsyncThunk(
  'apartments/fetchApartmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getApartmentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createApartment = createAsyncThunk(
  'apartments/createApartment',
  async (apartmentData, { rejectWithValue }) => {
    try {
      const response = await api.createApartment(apartmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateApartment = createAsyncThunk(
  'apartments/updateApartment',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.updateApartment(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteApartment = createAsyncThunk(
  'apartments/deleteApartment',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteApartment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  apartments: [],
  apartment: null,
  loading: false,
  error: null,
  success: false,
  filters: {
    minPrice: '',
    maxPrice: '',
    rooms: ''
  }
};

const apartmentSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = {
        minPrice: '',
        maxPrice: '',
        rooms: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = action.payload;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch apartments';
      })
      
      .addCase(fetchApartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.apartment = action.payload;
      })
      .addCase(fetchApartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch apartment details';
      })
      
      .addCase(createApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.apartments.unshift(action.payload);
      })
      .addCase(createApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create apartment';
      })
      
      .addCase(updateApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.apartments = state.apartments.map(apartment => 
          apartment._id === action.payload._id ? action.payload : apartment
        );
        state.apartment = action.payload;
      })
      .addCase(updateApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update apartment';
      })
      
      .addCase(deleteApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.apartments = state.apartments.filter(apartment => apartment._id !== action.payload);
        if (state.apartment && state.apartment._id === action.payload) {
          state.apartment = null;
        }
      })
      .addCase(deleteApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete apartment';
      });
  }
});

export const { resetSuccess, resetError, setFilters, resetFilters } = apartmentSlice.actions;
export default apartmentSlice.reducer;