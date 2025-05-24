import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: { 
    type: String, 
    required: false,
    validate: {
      validator: function(v) {
        return v === '' || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
    
  },
  userType: { type: String, enum: ["User", "Worker"], required: true },
  pincode: String,
  address: String,
  location: {
    lat: Number,
    lng: Number
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);