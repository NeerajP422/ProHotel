const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please provide a room number'],
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a room title'],
    trim: true,
  },
  roomType: {
    type: String,
    required: [true, 'Please specify room type'],
    enum: [
      'Deluxe King',
      'Executive Suite',
      'Presidential Suite',
      'Premium Double',
      'Skyline Penthouse',
      'Garden Villa',
      'Family Suite'
    ],
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please provide price per night'],
    min: [0, 'Price must be positive'],
  },
  capacity: {
    adults: { type: Number, default: 2, min: 1 },
    children: { type: Number, default: 0, min: 0 },
  },
  bedType: {
    type: String,
    default: 'King Bed',
  },
  sizeSqFt: {
    type: Number,
    default: 450,
  },
  floor: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  amenities: {
    type: [String],
    default: ['High-Speed Wi-Fi', 'Climate Control', 'Smart 4K TV', 'Room Service', 'Mini Bar'],
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one room image'],
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'cleaning', 'maintenance'],
    default: 'available',
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);
