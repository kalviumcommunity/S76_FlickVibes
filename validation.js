const Joi = require('joi');

// Define validation schema for movies
const movieSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(), 
    genre: Joi.array().items(Joi.string().min(1)).min(1).required(), 
    releaseYear: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .required(),
    rating: Joi.number().min(0).max(10).required(), 
    streamingPlatforms: Joi.array().items(Joi.string().min(1)).min(1).required(), 
    cast: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().min(1).required(), 
                role: Joi.string().min(1).required(), 
            })
        )
        .min(1)
        .required(),
    moodTags: Joi.array().items(Joi.string().min(1)).min(1).required(), 
    language: Joi.string().min(1).max(50).required(), 
});


const validateMovie = (movie) => {
    return movieSchema.validate(movie, { abortEarly: false }); 
};


module.exports = { validateMovie };
