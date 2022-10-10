const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: (image) => /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm.test(image),
        },
    },
    trailerLink: {
        type: String,
        required: true,
        validate: {
            validator: (trailerLink) => /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm.test(trailerLink),
        },
    },
    thumbnail: {
        type: String,
        required: true,
        validate: {
            validator: (thumbnail) => /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm.test(thumbnail),
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    movieId: {
        type: Number,
        required: true,
    },
    nameRU: {
        type: String,
        required: true,
    },
    nameEN: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('movie', movieSchema);