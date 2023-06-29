const mongoose = require('mongoose');
const { Schema } = mongoose


const RubriqueTypeSchema = Schema({
    title: String,
    description: String,
    link: {type: String, unique: true},
    parent: String
})

const RubriqueTypeModel = mongoose.model('RubriqueType', RubriqueTypeSchema);


module.exports = RubriqueTypeModel;