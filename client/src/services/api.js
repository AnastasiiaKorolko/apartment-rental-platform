import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  getApartments: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.rooms) queryParams.append('rooms', filters.rooms);
    
    return axios.get(`${API_URL}/apartments?${queryParams.toString()}`);
  },
  
  getApartmentById: (id) => {
    return axios.get(`${API_URL}/apartments/${id}`);
  },
  
  createApartment: (formData) => {
    return axios.post(`${API_URL}/apartments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  updateApartment: (id, formData) => {
    return axios.put(`${API_URL}/apartments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteApartment: (id) => {
    return axios.delete(`${API_URL}/apartments/${id}`);
  }
};

export default api;