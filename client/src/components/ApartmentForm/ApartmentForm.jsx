import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createApartment, updateApartment, resetError, resetSuccess } from '../../redux/slices/apartmentSlice';
import styles from './ApartmentForm.module.css';

const ApartmentForm = ({ apartment = null, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.apartments);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    rooms: '',
    images: []
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (apartment) {
      setFormData({
        title: apartment.title || '',
        description: apartment.description || '',
        price: apartment.price || '',
        rooms: apartment.rooms || '',
        images: []
      });

      if (apartment.images && apartment.images.length > 0) {
        setExistingImages(apartment.images.map((img, index) => ({
          url: img,
          id: `existing-${index}`,
          isExisting: true
        })))
      }
    }
  }, [apartment]);

  useEffect(() => {
    if (success) {
      setFormData({
        title: '',
        description: '',
        price: '',
        rooms: '',
        images: []
      });
      setImagePreview([]);
      setExistingImages([]);

      if (onClose) {
        setTimeout(() => {
          dispatch(resetSuccess());
          onClose();
        }, 1500);
      }
    }
  }, [success, dispatch, onClose]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetSuccess());
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 90) {
      errors.title = 'Title must be less than 90 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length > 335) {
      errors.description = 'Description must be less than 335 characters';
    }

    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (!formData.rooms) {
      errors.rooms = 'Number of rooms is required';
    } else if (![1, 2, 3].includes(Number(formData.rooms))) {
      errors.rooms = 'Number of rooms must be 1, 2, or 3';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      isExisting: false
    }));

    setImagePreview(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleRemoveImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      rooms: formData.rooms,
      images: formData.images,
      existingImages: existingImages.map(img => img.url)
    };

    if (apartment) {
      dispatch(updateApartment({ id: apartment._id, apartmentData: submitData }));
    } else {
      dispatch(createApartment(submitData));
    }
  };

  const totalImagesCount = existingImages.length + imagePreview.length

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {apartment ? 'Edit Apartment' : 'Add New Apartment'}
      </h2>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          {error}
        </div>
      )}

      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          {apartment ? 'Apartment updated successfully!' : 'Apartment created successfully!'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="title">
            Title <span>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={`${styles.input} ${formErrors.title ? styles.inputError : ''}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="Apartment title"
            maxLength={90}
          />
          {formErrors.title && <p className={styles.errorText}>{formErrors.title}</p>}
          <p className={styles.charCounter}>{formData.title.length}/90 characters</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">
            Description <span>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`${styles.textarea} ${formErrors.description ? styles.inputError : ''}`}
            value={formData.description}
            onChange={handleChange}
            maxLength={335}
            rows={4}
            placeholder="Apartment description"
          />
          {formErrors.description && <p className={styles.errorText}>{formErrors.description}</p>}
          <p className={styles.charCounter}>{formData.description.length}/335 characters</p>
        </div>

        <div className={`${styles.grid} ${styles.gridTwo}`}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="price">
              Price <span>*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className={`${styles.input} ${formErrors.price ? styles.inputError : ''}`}
              value={formData.price}
              onChange={handleChange}
              min="0"
              placeholder="Price"
            />
            {formErrors.price && <p className={styles.errorText}>{formErrors.price}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="rooms">
              Number of Rooms <span>*</span>
            </label>
            <select
              id="rooms"
              name="rooms"
              className={`${styles.select} ${formErrors.rooms ? styles.inputError : ''}`}
              value={formData.rooms}
              onChange={handleChange}
            >
              <option value="">Select number of rooms</option>
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
            </select>
            {formErrors.rooms && <p className={styles.errorText}>{formErrors.rooms}</p>}
          </div>
        </div>

        {existingImages.length > 0 && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Current Images</label>
            <div className={styles.previewContainer}>
              {existingImages.map((image, index) => (
                <div key={image.id} className={styles.imageWrapper}>
                  <img src={image.url} alt={`Current ${index + 1}`} className={styles.previewImage} />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className={styles.removeButton}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="images">
            {apartment ? 'Add New Images (Optional)' : 'Images (Optional)'}
            {totalImagesCount > 0 && (
              <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                ({totalImagesCount} image{totalImagesCount !== 1 ? 's' : ''} total)
              </span>
            )}
          </label>
          <input
            type="file"
            id="images"
            name="images"
            className={styles.fileInput}
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />
          <p className={styles.charCounter}>You can upload multiple images</p>
        </div>

        {imagePreview.length > 0 && (
          <div className={styles.previewContainer}>
            {imagePreview.map((image, index) => (
              <div key={index} className={styles.imageWrapper}>
                <img src={image.url} alt={`Preview ${index + 1}`} className={styles.previewImage} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className={styles.removeButton}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className={styles.input} disabled={loading}>
          {loading ? 'Submitting...' : apartment ? 'Update Apartment' : 'Create Apartment'}
        </button>
      </form>
    </div>
  );
};

export default ApartmentForm;
