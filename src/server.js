const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// basic health
app.get('/', (req, res) => res.json({ message: 'Hotel Booking API (Mongo) running' }));

// error handler must be last
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

(async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
})();
