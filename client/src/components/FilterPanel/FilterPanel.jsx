import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters, fetchApartments } from '../../redux/slices/apartmentSlice';
import styles from './FilterPanel.module.css';


const FilterPanel = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.apartments);
  
  const [localFilters, setLocalFilters] = useState({
    minPrice: '',
    maxPrice: '',
    rooms: ''
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    dispatch(setFilters(localFilters));
    dispatch(fetchApartments(localFilters));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(fetchApartments({}));
  };

  return (
    <div className={styles.filterPanel}>
      <h2 className={styles.title}>Filters</h2>
      
      <form onSubmit={handleApplyFilters}>
        <div className={styles.formGroup}>
          <label htmlFor="minPrice" className={styles.label}>
            Minimal price:
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={localFilters.minPrice}
            onChange={handleChange}
            min="0"
            className={styles.input}
            placeholder="From"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="maxPrice" className={styles.label}>
            Max price:
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={localFilters.maxPrice}
            onChange={handleChange}
            min="0"
            className={styles.input}
            placeholder="To"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="rooms" className={styles.label}>
           Number of rooms:
          </label>
          <select
            id="rooms"
            name="rooms"
            value={localFilters.rooms}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">All options</option>
            <option value="1">1 room</option>
            <option value="2">2 rooms</option>
            <option value="3">3 rooms</option>

          </select>
        </div>
        
        <div className={styles.buttonGroup}>
          <button type="submit" className={`${styles.applyButton} btn btn-primary`}>
          Apply
          </button>
          <button 
            type="button" 
            className={styles.resetButton}
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;