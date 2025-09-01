// src/models/Location.js (unchanged)
const { Schema, model } = require('mongoose');

const LocationSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  floor: Number,
  coordinates: { x: Number, y: Number, z: Number },
  parent: { type: Schema.Types.ObjectId, ref: 'Location' } // support nested locations
}, { timestamps: true });

module.exports = model('Location', LocationSchema);
