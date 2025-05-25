import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  serviceType: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  urgency: {
    type: String,
    enum: ["normal", "urgent", "emergency"],
    default: "normal"
  },
  scheduledTime: Date,
  jobDescription: String,
  createdAt: { type: Date, default: Date.now },
  hasReview: {
    type: Boolean,
    default: false
  }
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);