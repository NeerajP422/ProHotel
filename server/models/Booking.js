const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: [true, 'Please provide check-in date'],
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please provide check-out date'],
  },
  totalNights: {
    type: Number,
    required: true,
    min: 1,
  },
  guests: {
    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },
  },
  guestInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequests: { type: String, default: '' },
  },
  pricing: {
    roomRate: { type: Number, required: true },
    nightsTotal: { type: Number, required: true },
    taxes: { type: Number, required: true },
    cleaningFee: { type: Number, default: 35 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'paid',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'pay_at_desk'],
    default: 'credit_card',
  },
  paymentDetails: {
    transactionId: { type: String, default: () => 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase() },
    cardLast4: { type: String, default: '4242' },
    paidAt: { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ['confirmed', 'checked_in', 'checked_out', 'cancelled'],
    default: 'confirmed',
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
