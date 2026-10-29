const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const ServiceRequest = require('./models/ServiceRequest');
const {
  initialUsers,
  initialRooms,
  initialBookings,
  initialReviews,
  initialServices,
} = require('./data/initialData');

const seedDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected successfully.');

    // Clear existing collections
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await ServiceRequest.deleteMany();
    console.log('Cleared existing collections.');

    // Insert initial users
    await User.insertMany(initialUsers);
    console.log(`Seeded ${initialUsers.length} users.`);

    // Insert rooms
    await Room.insertMany(initialRooms);
    console.log(`Seeded ${initialRooms.length} luxury rooms.`);

    // Insert bookings
    await Booking.insertMany(initialBookings);
    console.log(`Seeded ${initialBookings.length} bookings.`);

    // Insert reviews
    await Review.insertMany(initialReviews);
    console.log(`Seeded ${initialReviews.length} reviews.`);

    // Insert service requests
    await ServiceRequest.insertMany(initialServices);
    console.log(`Seeded ${initialServices.length} operational service requests.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
