const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getDbStatus } = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Route imports
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'HotelPro API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: getDbStatus() ? 'MongoDB (Live Connected)' : 'In-Memory Reactive Store (Active)',
  });
});

// Root greeting
app.get('/', (req, res) => {
  res.send('Welcome to HotelPro API - Complete Hotel Booking & Management System');
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏨  HotelPro API Engine running on http://localhost:${PORT}`);
    console.log(`📊  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🛡️   Authentication: JWT + bcryptjs active`);
    console.log(`====================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });
};

startServer();
