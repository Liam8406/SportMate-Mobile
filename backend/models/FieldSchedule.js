const mongoose = require("mongoose");

// Store one scheduled game and its players.
const SessionSchema = new mongoose.Schema({
  fieldId: { type: String, required: true, index: true },
  fieldName: String,
  sport: String,

  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },

  date: String, 
  startTime: String,  
  startTimeDate: Date,
  endTime: Date,      
  durationMinutes: Number,

  maxPlayers: { type: Number, default: 12 },
  currentPlayers: { type: Number, default: 1 },
  players: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
}, { timestamps: true });

// Remove a game from MongoDB after it ends.
SessionSchema.index({ endTime: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", SessionSchema);
