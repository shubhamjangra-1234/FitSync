const mongoose = require('mongoose');
require('dotenv').config();
// Connect to MongoDB Atlas using .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Failed:', err));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: [true, 'Phone number is required'],
   
  },
  email: {
    type: String,
    required: true,
    
  },
  goalCalories: Number,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
