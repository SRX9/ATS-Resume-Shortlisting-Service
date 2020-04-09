const express = require('express');
const router = express.Router();
const multer = require('multer')
const ctrlUser = require('../controller/user.controller');
const ctrlCompany = require('../controller/company.controller');
const ctrlJob = require('../controller/jobPost.controller');


const jwtHelper = require('../config/jwtHelper');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/Users/Dell/Desktop/ssip2/server/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })
router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);

router.post('/registercmp', upload.single('myFile'),ctrlCompany.register);
router.post('/authenticatecmp', ctrlCompany.authenticate);
router.get('/companyProfile',jwtHelper.verifyJwtToken, ctrlCompany.companyProfile);

router.post('/PostJob', ctrlJob.register);
router.get('/getJobs', ctrlJob.allJobs);

module.exports = router;
