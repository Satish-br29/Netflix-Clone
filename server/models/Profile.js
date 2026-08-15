const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Profile name is required'],
    trim: true,
    maxlength: 20,
  },
  avatar: {
    type: String,
    default: '/avatars/default.png',
  },
  isKids: {
    type: Boolean,
    default: false,
  },
  myList: [{
    movieId: Number,
    mediaType: String,
    addedAt: { type: Date, default: Date.now },
  }],
  watchHistory: [{
    movieId: Number,
    mediaType: String,
    watchedAt: { type: Date, default: Date.now },
  }],
  continueWatching: [{
    movieId: Number,
    mediaType: String,
    watchedTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    percentageWatched: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', profileSchema);
