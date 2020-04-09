const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('Candidate');
var Company=mongoose.model('Company');

passport.use('candidate',
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({ email: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                    {
                      return done(null, false, { message: 'Email is not registered for user' });
                    }
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password for user.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);

passport.use('company',
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            Company.findOne({ email: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                    {
                      return done(null, false, { message: 'Email is not registered for company' });
                    }
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password for company.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);


