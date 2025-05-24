import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://kind-solace-production.up.railway.app';

const API_URL = `${API_BASE_URL}/api/apartments`;

export const fetchApartments = createAsyncThunk(
  'apartments/fetchApartments',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.rooms) params.append('rooms', filters.rooms);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await axios.get(`${API_URL}${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchApartmentById = createAsyncThunk(
  'apartments/fetchApartmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createApartment = createAsyncThunk(
  'apartments/createApartment',
  async (apartmentData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', apartmentData.title);
      formData.append('description', apartmentData.description);
      formData.append('price', apartmentData.price);
      formData.append('rooms', apartmentData.rooms);
      
      if (apartmentData.images && apartmentData.images.length > 0) {
        for (let i = 0; i < apartmentData.images.length; i++) {
          formData.append('images', apartmentData.images[i]);
        }
      }
      
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateApartment = createAsyncThunk(
  'apartments/updateApartment',
  async ({ id, apartmentData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      if (apartmentData.title) formData.append('title', apartmentData.title);
      if (apartmentData.description) formData.append('description', apartmentData.description);
      if (apartmentData.price) formData.append('price', apartmentData.price);
      if (apartmentData.rooms) formData.append('rooms', apartmentData.rooms);
      
      if (apartmentData.images && apartmentData.images.length > 0) {
        for (let i = 0; i < apartmentData.images.length; i++) {
          formData.append('images', apartmentData.images[i]);
        }
      }

      if (apartmentData.existingImages && apartmentData.existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(apartmentData.existingImages));
      }
      
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteApartment = createAsyncThunk(
  'apartments/deleteApartment',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  apartments: [],
  currentApartment: null,
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
      state.filters = initialState.filters;
    },
    resetCurrentApartment: (state) => {
      state.currentApartment = null;
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
        state.error = action.payload?.message || 'Error fetching apartments';
      })
      
      .addCase(fetchApartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApartment = action.payload;
      })
      .addCase(fetchApartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching apartment';
      })
      
      .addCase(createApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = [action.payload, ...state.apartments];
        state.success = true;
      })
      .addCase(createApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error creating apartment';
        state.success = false;
      })
      
      .addCase(updateApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = state.apartments.map(apt => 
          apt._id === action.payload._id ? action.payload : apt
        );
        if (state.currentApartment && state.currentApartment._id === action.payload._id) {
          state.currentApartment = action.payload;
        }
        state.success = true;
      })
      .addCase(updateApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error updating apartmen';
        state.success = false;
      })
      
      .addCase(deleteApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = state.apartments.filter(apt => apt._id !== action.payload);
        if (state.currentApartment && state.currentApartment._id === action.payload) {
          state.currentApartment = null;
        }
        state.success = true;
      })
      .addCase(deleteApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error deleting apartment';
        state.success = false;
      });
  }
});

export const { resetSuccess, resetError, setFilters, resetFilters, resetCurrentApartment } = apartmentSlice.actions;
export default apartmentSlice.reducer;