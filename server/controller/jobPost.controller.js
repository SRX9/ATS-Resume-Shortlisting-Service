const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const job = mongoose.model('Job');

module.exports.register = (req, res, next) => {

  var user = new job();
    console.log('inside job controller');
    user.Title = req.body.Title;
    user.companyId = req.body.companyId;
    user.description = req.body.description;
    user.location = req.body.location;
    user.skills=req.body.skills;
    user.experience = req.body.experience;
    user.degree = req.body.degree;
    user.jobType = req.body.jobType;
    user.salary = req.body.salary;
    user.datePosted = req.body.datePosted;
    user.lastDateToApply= req.body.lastDateToApply;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}



module.exports.allJobs = (req, res, next) =>{
    job.find(
        (err, job) => {
            if (err)
                console.error(err);
            else
            {
                console.log(job);
                res.status(200).json({ status: true, jobs : job});
            }
        }
    );

}
