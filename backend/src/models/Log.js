// src/models/Log.js
const { Schema, model, Types } = require('mongoose');

const LogSchema = new Schema({
  actorType: { type: String, enum: ['patient','staff','system'], default: 'system' },
  actorId: { type: Types.ObjectId },
  action: { type: String, required: true },
  meta: { type: Object, default: {} },
}, { timestamps: true });

module.exports = model('Log', LogSchema);
