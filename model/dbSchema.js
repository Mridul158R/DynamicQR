const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },
  OriginalUrl: {
    type: String,
    required: true,
  },
  ShortUrl: {
    type: String,
    required: true,
  },
  QrCode:{
    type: String,
    required: true, 
  },
  ClickCount: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model('qrcodedb',dbSchema);
