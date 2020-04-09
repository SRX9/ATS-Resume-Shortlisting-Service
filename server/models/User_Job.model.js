const mongoose = require('mongoose');


var userjobSchema = new mongoose.Schema({
    userId: {
      type:String,
         required: 'user id can\'t be empty',
    },
    username:{
      type:String,
    },
    jobId: {
        type:String,
        required: 'job id can\'t be empty',
    },

    resume: {
      type : String,
      required: 'resume id can\'t be empty',
    },
    score:{
      type:Number
    }


});



mongoose.model('UserJob', userjobSchema);
