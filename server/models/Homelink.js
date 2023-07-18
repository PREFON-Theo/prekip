const mongoose = require('mongoose');
const { Schema } = mongoose


const HomelinkSchema = Schema({
    text: String,
    link: String,
    place: Number
})

const HomelinkModel = mongoose.model('Homelink', HomelinkSchema);


module.exports = HomelinkModel;