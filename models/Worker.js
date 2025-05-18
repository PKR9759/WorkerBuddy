import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skills: [String],
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: String,
      comment: String,
      rating: Number
    }
  ],
  verified: { type: Boolean, default: false },
  workHistory: [
    {
      bookingId: mongoose.Schema.Types.ObjectId
    }
  ]
});

export default mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);
