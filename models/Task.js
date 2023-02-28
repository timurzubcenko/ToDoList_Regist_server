const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        required: true
    },
})

module.exports = Task = mongoose.model('task', taskSchema)