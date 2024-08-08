const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  delivery_id: String,
  package_id: String,
  pickup_time: Date,
  start_time: Date,
  end_time: Date,
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
  },
})

module.exports = mongoose.model('Delivery', DeliverySchema) || mongoose.models.Delivery