const mongoose = require('mongoose');
const { Schema } = mongoose


const UserSchema = Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true},
    password: String,
    roles: {
        type: Array,
        default: ["Utilisateur"]
    },
    joiningDate: Date,
    leavingDate: Date,
    valid: {
        type: Boolean,
        default: true
    },
    divisions: {
        type: Array,
        default: []
    },
})

const UserModel = mongoose.model('User', UserSchema);


module.exports = UserModel;