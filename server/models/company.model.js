const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name can\'t be empty',
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    description: {
        type: String,
        required: 'description can\'t be empty',

    },
    type: {
        type: String,
        required: 'type can\'t be empty',
    },
    logo:{
      type:String,
      required:'logo can\'t be empmty',
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    saltSecret: String
});

// Custom validation for email
companySchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


// Events
companySchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
companySchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

companySchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



mongoose.model('Company', companySchema);
