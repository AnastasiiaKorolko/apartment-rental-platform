import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteApartment } from '../../redux/slices/apartmentSlice';
import styles from './ApartmentItem.module.css';

const ApartmentItem = ({ apartment, onEdit }) => {
  const dispatch = useDispatch();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const handleDelete = () => {
    if (confirmDelete) {
      dispatch(deleteApartment(apartment._id));
    } else {
      setConfirmDelete(true);
      
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };
  
  const getRoomsText = (rooms) => {
    switch (Number(rooms)) {
      case 1:
        return '1 room';
      case 2:
        return '2 rooms';
      case 3:
        return '3 rooms';
      default:
        return `${rooms} room`;
    }
  };

  return (
    <div className={styles.apartmentItem}>
      {apartment.images && apartment.images.length > 0 ? (
        <div className={styles.imageContainer}>
          <img 
            src={apartment.images[0]} 
            alt={apartment.title} 
            className={styles.apartmentImage}
          />
        </div>
      ) : (
        <div className={styles.noImage}>
          No photo
        </div>
      )}
      
      <div className={styles.apartmentContent}>
        <h3 className={styles.title}>{apartment.title}</h3>
        <p className={styles.price}>{formatPrice(apartment.price)}</p>
        <p className={styles.rooms}>{getRoomsText(apartment.rooms)}</p>
        <p className={styles.description}>{apartment.description}</p>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={`${styles.editBtn} btn btn-secondary`}
          onClick={onEdit}
        >
          Edit
        </button>
        
        <button 
          className={`${styles.deleteBtn} btn ${confirmDelete ? 'btn-danger' : ''}`}
          onClick={handleDelete}
        >
          {confirmDelete ? 'Conferm delete?' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ApartmentItem;