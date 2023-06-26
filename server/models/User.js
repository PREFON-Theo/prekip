const mongoose = require('mongoose');
const { Schema } = mongoose


const UserSchema = Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true},
    password: String,
    role: String,
    joiningDate: Date,
    leavingDate: Date,
    valid: Boolean
})

const UserModel = mongoose.model('User', UserSchema);


module.exports = UserModel;