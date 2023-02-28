const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
})

module.exports = User = mongoose.model('user', userSchema)