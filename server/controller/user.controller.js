const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const Candidate = mongoose.model('Candidate');

module.exports.register = (req, res, next) => {
    var user = new Candidate();

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.contact = req.body.contact;
    user.degree = req.body.degree;
    user.institute = req.body.institute;
    user.DOB = req.body.DOB;
    user.password = req.body.password;
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

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('candidate', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    Candidate.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id','firstName','lastName','email','contact','DOB','institute','degree']) });
        }
    );
}
