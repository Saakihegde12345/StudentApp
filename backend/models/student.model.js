const mongoose = require('mongoose');

const studenSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    usn: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

const Student = mongoose.model("students", studenSchema);
module.exports = Student;