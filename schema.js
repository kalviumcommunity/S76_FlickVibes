const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true, 
    minlength: [3, 'Title should be at least 3 characters long']
  },
  genre: { 
    type: [String], 
    required: [true, 'Genre is required'], 
    validate: [array => array.length > 0, 'At least one genre is required']
  },
  releaseYear: { 
    type: Number, 
    required: [true, 'Release Year is required'], 
    min: [1900, 'Release Year must be greater than 1900'],
    max: [new Date().getFullYear(), 'Release Year cannot be in the future']
  },
  rating: { 
    type: Number, 
    required: [true, 'Rating is required'], 
    min: [0, 'Rating cannot be less than 0'], 
    max: [10, 'Rating cannot be more than 10']
  },
  streamingPlatforms: { 
    type: [String], 
    required: [true, 'At least one streaming platform is required'], 
    validate: [array => array.length > 0, 'At least one streaming platform is required']
  },
  cast: [
    {
      name: { 
        type: String, 
        required: [true, 'Cast name is required'], 
        trim: true 
      },
      role: { 
        type: String, 
        required: [true, 'Role is required'], 
        trim: true 
      }
    }
  ],
  moodTags: { 
    type: [String], 
    required: [true, 'Mood tags are required'],
    validate: [array => array.length > 0, 'At least one mood tag is required']
  },
  language: { 
    type: String, 
    required: [true, 'Language is required'], 
    trim: true 
  }
});

module.exports = mongoose.model("Movie", movieSchema);
