const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  package_id: String,
  active_delivery_id: String,
  description: String,
  weight: Number,
  width: Number,
  height: Number,
  depth: Number,
  from_name: String,
  from_address: String,
  from_location: {
    lat: Number,
    lng: Number,
  },
  to_name: String,
  to_address: String,
  to_location: {
    lat: Number,
    lng: Number,
  },
})

module.exports = mongoose.model('Package', PackageSchema) || mongoose.models.Package