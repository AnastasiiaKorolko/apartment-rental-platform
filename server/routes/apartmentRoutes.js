const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getApartments, 
  getApartmentById, 
  createApartment, 
  updateApartment, 
  deleteApartment 
} = require('../controllers/apartmentController');


const imageTypes = /jpeg|jpg|png|webp|avif|gif/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const extname = imageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = imageTypes.test(file.mimetype);

    extname && mimetype ? cb(null, true) : cb('Error: Images only!');
  }
});


router.get('/', getApartments);
router.get('/:id', getApartmentById);
router.post('/', upload.array('images', 5), createApartment);
router.put('/:id', upload.array('images', 5), updateApartment);
router.delete('/:id', deleteApartment);

module.exports = router;