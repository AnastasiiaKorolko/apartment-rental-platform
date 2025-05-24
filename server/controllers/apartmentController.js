const Apartment = require('../models/Apartment');

const getApartments = async (req, res) => {
  try {
    const { minPrice, maxPrice, rooms } = req.query;

    let filter = {};

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (rooms !== undefined) {
      filter.rooms = Number(rooms);
    }

    const apartments = await Apartment.find(filter).sort({ createdAt: -1 });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: 'Server error to fetch apartments', error: error.message })
  }
};

const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({ message: 'Apartment is not defined' });
    }

    res.json(apartment);
  } catch (error) {
    res.status(500).json({ message: 'Server error to fetch apartment', error: error.message });
  }
};

const createApartment = async (req, res) => {
  try {
    const { title, description, price, rooms } = req.body;

    if (!title || !description || !price || !rooms) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const apartmentData = {
      title,
      description,
      price: Number(price),
      rooms: Number(rooms)
    };

    if (req.files && req.files.length > 0) {
      apartmentData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const apartment = await Apartment.create(apartmentData);

    res.status(201).json(apartment);
  } catch (error) {
    res.status(400).json({ message: 'Error while creating the apartment', error: error.message });
  }
};

const updateApartment = async (req, res) => {
  try {
    const { title, description, price, rooms } = req.body;

    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({ message: 'Apartment is not defined' });
    }

    apartment.title = title || apartment.title;
    apartment.description = description || apartment.description;
    apartment.price = price || apartment.price;
    apartment.rooms = rooms || apartment.rooms;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      apartment.images = [...apartment.images, ...newImages];
    }

    const updatedApartment = await apartment.save();

    res.json(updatedApartment);
  } catch (error) {
    res.status(400).json({ message: 'Error while update apartment', error: error.message });
  }
};

const deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({ message: 'Apartment is not defined' });
    }

    await apartment.deleteOne();

    res.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error while to delete apartment', error: error.message });
  }
}

module.exports = {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment
};