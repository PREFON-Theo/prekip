const mongoose = require('mongoose');
const { Schema } = mongoose


const UserSchema = Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true},
    password: String,
    roles: {
        type: Array,
        default: ["User"]
    },
    joiningDate: Date,
    leavingDate: Date,
    valid: {
        type: Boolean,
        default: true
    }
})

const UserModel = mongoose.model('User', UserSchema);


module.exports = UserModel;