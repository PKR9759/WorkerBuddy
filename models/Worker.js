import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [String],
  availability: { type: Boolean, default: true },
  pricePerHour: { type: Number},
  timeSlots: {
    monday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "18:00" }
    },
    tuesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "18:00" }
    },
    wednesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "18:00" }
    },
    thursday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "18:00" }
    },
    friday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "18:00" }
    },
    saturday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "18:00" }
    },
    sunday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "18:00" }
    }
  },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      rating: { type: Number, min: 1, max: 5 },
      jobType: String, // What service was provided
      createdAt: { type: Date, default: Date.now }
    }
  ],
  verified: { type: Boolean, default: false },
  completedJobs: { type: Number, default: 0 },
  workHistory: [
    {
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
    }
  ]
}, {
  timestamps: true
});

// Update average rating whenever reviews are modified
WorkerSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
  } else {
    this.rating = 0;
  }
  next();
});

export default mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);