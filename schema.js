const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  releaseYear: { type: Number, required: true },
  rating: { type: Number, required: true },
  streamingPlatforms: { type: [String], required: true },
  cast: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true }
    }
  ],
  moodTags: { type: [String], required: true },
  language: { type: String, required: true }
});

module.exports = mongoose.model("Movie", movieSchema);
