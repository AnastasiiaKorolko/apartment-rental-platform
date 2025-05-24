import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApartments } from '../../redux/slices/apartmentSlice';
import ApartmentItem from '../ApartmentItem/ApartmentItem';
import styles from './ApartmentList.module.css';

const ApartmentList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { apartments, loading, filters } = useSelector(state => state.apartments);

  useEffect(() => {
    dispatch(fetchApartments(filters));
  }, [dispatch, filters]);

  if (loading && apartments.length === 0) {
    return <div className={styles.loading}>Loading apartments...</div>;
  }

  if (apartments.length === 0) {
    return (
      <div className={styles.emptyList}>
        <p>Квартири не знайдено</p>
        {(filters.minPrice || filters.maxPrice || filters.rooms) && (
          <p>Try adjusting the filter parameters</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.apartmentList}>
      {apartments.map(apartment => (
        <ApartmentItem 
          key={apartment._id} 
          apartment={apartment} 
          onEdit={() => onEdit(apartment)}
        />
      ))}
    </div>
  );
};

export default ApartmentList;