require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apartmentRoutes = require('./routes/apartmentRoutes');


const app = express();

connectDB();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://apartment-rental-platform-fpmn.vercel.app'
  ],
  credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Apartment Rental API is running!', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    message: 'Server is healthy!', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/apartments', apartmentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});