import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApartments, resetSuccess } from './redux/slices/apartmentSlice';
import ApartmentList from './components/ApartmentList/ApartmentList';
import ApartmentForm from './components/ApartmentForm/ApartmentForm';
import FilterPanel from './components/FilterPanel/FilterPanel';
import styles from './App.module.css';

function App() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.apartments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);

  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setIsFormOpen(false);
      setEditingApartment(null);
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

  const handleEdit = (apartment) => {
    setEditingApartment(apartment);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingApartment(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingApartment(null);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Apartment Management Panel</h1>
        <button
          className={styles.addButton}
          onClick={handleAddNew}
          disabled={isFormOpen}
        >
          Add Apartment
        </button>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <main className={styles.main}>
        <FilterPanel />
        
        <div className={styles.content}>
          {isFormOpen ? (
            <ApartmentForm
              apartment={editingApartment}
              onClose={handleCloseForm}
            />
          ) : (
            <ApartmentList onEdit={handleEdit} />
          )}
        </div>
      </main>

      {loading && <div className={styles.loader}>Loading...</div>}
    </div>
  );
}

export default App;