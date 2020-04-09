const mongoose = require('mongoose');
const Schema=mongoose.Schema;

var jobSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: 'role can\'t be empty',
    },
    companyId: {
        type: String,
        required: 'company id can\'t be empty',
    },
    description: {
        type: String,
        required: 'description can\'t be empty',

    },
    location: {
        type: String,
        required: 'location can\'t be empty',
    },
    skills: [String],
    experience: {
        type: Number
    },
    degree:[String],
    jobType: [ String],
    salary: {
        type: Number,
        required: 'type can\'t be empty',
    },
    datePosted: {
        type: Date,
        required: 'type can\'t be empty',
    },
    lastDateToApply: {
        type: Date,
        required: 'type can\'t be empty',
    },


});



mongoose.model('Job', jobSchema);
