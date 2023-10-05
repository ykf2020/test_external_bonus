const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  customer_id: {
      required: true,
      type: Number
  },
  email: {
    required: true,
    type: String
  },
  bonus_points: {
      required: true,
      type: Number
  }
})

module.exports = mongoose.model('Data', dataSchema)