require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apartmentRoutes = require('./routes/apartmentRoutes');

const app = express();

connectDB();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://apartment-rental-platform-fpmn.vercel.app',
      'https://kind-solace-production.up.railway.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.options('*', cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Apartment Rental API is running!', 
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      apartments: '/api/apartments',
      health: '/health'
    },
    cors: 'enabled'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    message: 'Server is healthy!', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/apartments', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}, apartmentRoutes);

app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: `API endpoint ${req.originalUrl} not found`,
    availableEndpoints: ['/api/apartments']
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for all origins');
});