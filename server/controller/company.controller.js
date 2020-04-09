const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const multer = require('multer');
const Company = mongoose.model('Company');

module.exports.register = (req, res, next) => {
  const file = req;
  console.log(file,'rgfgdfgd');
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }

    var user = new Company();
    console.log('inside company controller');
    user.name = req.body.name;
    user.email = req.body.email;
    user.description = req.body.description;
    user.type = req.body.type;
    user.logo='hii';
    user.password = req.body.password;

    console.log(user);
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
    passport.authenticate('company', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else
        {
          console.log("error is here\n");
           return res.status(404).json(info);
        }
    })(req, res);
}

module.exports.companyProfile = (req, res, next) =>{
    Company.findOne({ _id: req._id },
        (err, company) => {
            if (!company)
                return res.status(404).json({ status: false, message: 'Company record not found.' });
            else
            {
                console.log(company.companyAddress);
                return res.status(200).json({ status: true, company : _.pick(company,['_id','name','type','description','logo','email']) });
            }
        }
    );
}
