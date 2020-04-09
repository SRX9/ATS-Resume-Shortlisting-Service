require('./config/config');
require('./models/db.model');
require('./config/passportConfig');
const mongoose=require('mongoose');
const Company = mongoose.model('Company');
let Jobs = mongoose.model('Job');
const UsrJob = mongoose.model('UserJob');
const Candidate = mongoose.model('Candidate');

//require('./config/passportConfigCmp');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const rtsIndex = require('./routers/index.router');
const fs = require('fs');
const pdf = require('pdf-parse');
let stringSimilarity = require('string-similarity');
let { GenerateScore } = require('./Ultilities');

var app = express();
// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

app.use(passport.initialize());
app.use('/api', rtsIndex);

var unique = require('uniqid');
let imageLink;
let resumelink;
const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      // alert(Date.now());
        let temp =  unique()+file.originalname ;
        imageLink = "/uploads/"+temp;
        cb(null,temp);
    }
});

const imageStore = multer({
    storage: imageStorage, limits: {
        fileSize: 60000000
    },
    fileFilter: ''
});

const resumeStorage = multer.diskStorage({

  destination: function (req, file, cb) {
      cb(null, './resumes');
  },
  filename: function (req, file, cb) {
    // alert(Date.now());
      let temp = unique()+ file.originalname ;
      resumeLink = "/resumes/"+temp;
      cb(null,temp);
  }
});

const resumeStore = multer({
  storage: resumeStorage, limits: {
      fileSize: 60000000
  },
  fileFilter: ''
});

app.put('/imgsignup',imageStore.single('img'),(req,res)=>{
  console.log(imageLink);

  var user = new Company();
    console.log('inside company controller');
    user.name = req.body.name;
    user.email = req.body.email;
    user.description = req.body.description;
    user.type = req.body.type;
    user.logo=imageLink;
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

  // var newCmp=new ({
  //     postid:uniqid(),
  //     rname:req.body.name,
  //     dateAdded: req.body.date,
  //     text:req.body.desc,
  //     headline:req.body.headline,
  //     poster:[{imageLink}],
  //     likes:0,
  //     visits:0,
  //     genre:req.body.genre.split(',')
  // });
  // newPost.save().then(khantil=>{
  //     console.log(khantil," post uploaded")
  //     res.send("Post added successfully!!")
  // },(e)=>{
  //     console.log(e);
  // })

});

app.get('/getCandidates', (req, res) => {
  console.log(req.query)
  UsrJob.find({ jobId: req.query.jobid }).sort({score : -1}).exec( (err, docs) => {
    if (err) {
      res.send(false);
    }
    else {
      res.send(docs);
    }
  })
});

app.put('/applyJob',resumeStore.single('resume'),(req,res)=>{
  console.log(resumeLink);
  console.log(req.body.jobid);
  console.log(req.body.userid,"eeeee");
  let uid=req.body.userid;
  let jid=req.body.jobid;

  Candidate.findOne({ _id: uid }, "firstName lastName", (err, doc) => {

    let username = doc.firstName + " " + doc.lastName;
    let jobinfo = {
      skills: [],
      title: [],
      experience: [],
      descritpion: [],
      degree: [],
    }
    Jobs.findOne({ _id: jid }, (err, docs) => {
      jobinfo.skills = docs.skills,
        jobinfo.title = docs.Title,
        jobinfo.experience = docs.description,
        jobinfo.descritpion = docs.description,
        jobinfo.degree = docs.degree
    })

    let dataBuffer = fs.readFileSync('.'+resumeLink.toString());

    //Generating Tokens ans Sections
    let endTokens = [username, "summary", "FIELD OF INTEREST", "career objective", "top skills", "objective", "Activities", "courses", "course work", "personal info",
      "projects", "experience", "work experience", "internships", "employment history", "employment", "Postions of Responsiblities",
      "Responsiblities", "Achievements", "Accomplishemnts", "Extra", "Curricular", "Extra Activities",
      "interests", "hobbies", "Academic Background", "Academics",
      "skills", "professional skills", "professional skill", "work skill", "technical skill", "soft skills", "hard skills",
      "languages",
      "contact",
      "education",
      "studies",
      "apprenticeship",
      "certification", "profile"]
    //Sections Buffer
    let ProfileSections, HardSkillSection, SoftSkillSection, ProjectsSection,
      ExperienceSection, EducationSection, CertificationSection = [];

    pdf(dataBuffer).then(function (data) {
      var tokens = data.text.split("\n");
      //Profile | Objective Section
      let startIndex = 0;
      let endIndex = 0;
      let found = false;
      let endfound = false;
      for (let i = 0; i < tokens.length; i++) {
        if (endfound) {
          break;
        }
        let keys = tokens[i].split(' ');
        if (!found) {
          for (let j = 0; j < keys.length; j++) {
            if (stringSimilarity.compareTwoStrings(username.toLowerCase(), tokens[i].toLowerCase()) >= 0.90) {
              startIndex = i;
              found = true;
            }
            else if (stringSimilarity.compareTwoStrings("profile", keys[j].toLowerCase()) >= 0.90) {
              startIndex = i;
              found = true;
            }
            else if (stringSimilarity.compareTwoStrings("objective", keys[j].toLowerCase()) >= 0.90) {
              startIndex = i;
              found = true;
            }
            else if (stringSimilarity.compareTwoStrings("career objective", tokens[i].toLowerCase()) >= 0.90) {
              startIndex = i;
              found = true;
            }
            else if (stringSimilarity.compareTwoStrings("personal info", tokens[i].toLowerCase()) >= 0.90) {
              startIndex = i;
              found = true;
            }
          }
        }
        else {
          if (keys.length > 3) {
            continue;
          }

          for (let j = 0; j < keys.length; j++) {
            if (endfound) {
              break;
            }
            for (let k = 0; k < endTokens.length; k++) {
              if (stringSimilarity.compareTwoStrings(endTokens[k], keys[j].toLowerCase()) >= 0.85) {
                endIndex = i;
                endfound = true;
                break;
              }
            }
          }
        }
      }
      ProfileSections = tokens.slice(startIndex + 1, endIndex + 1);


      //Getting Hard Skill Section
      startIndex = 0;
      endIndex = 0;
      found = false;
      endfound = false;
      for (let i = 0; i < tokens.length; i++) {
        let keys = tokens[i].split(' ');
        if (endfound) {
          break;
        }
        if (keys.length > 3) {
          continue;
        }
        if (!found) {
          if (stringSimilarity.compareTwoStrings('skills', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("top skills", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("professional skills", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("professional skill", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("work skill", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("technical skills", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("hardskills", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
        }
        else {
          for (let j = 0; j < keys.length; j++) {
            if (endfound) {
              break;
            }
            for (let k = 0; k < endTokens.length; k++) {
              if (stringSimilarity.compareTwoStrings(endTokens[k], keys[j].toLowerCase()) >= 0.80) {
                endIndex = i;
                endfound = true;
                break;
              }
            }
          }
        }
        if (!endfound && found) {
          endIndex = i;
        }
      }
      HardSkillSection = tokens.slice(startIndex + 1, endIndex + 1)

      //Getting Soft Skill Section
      startIndex = 0;
      endIndex = 0;
      found = false;
      endfound = false;
      for (let i = 0; i < tokens.length; i++) {
        let keys = tokens[i].split(' ');
        if (endfound) {
          break;
        }
        if (keys.length > 3) {
          continue;
        }
        if (!found) {
          if (stringSimilarity.compareTwoStrings('soft skills', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          if (stringSimilarity.compareTwoStrings('soft skill', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("strengths", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("strength", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }

        }
        else {
          if (keys.length > 3) {
            continue;
          }

          for (j = 0; j < keys.length; j++) {
            if (endfound) {
              break;
            }
            for (let k = 0; k < endTokens.length; k++) {
              if (stringSimilarity.compareTwoStrings(endTokens[k], keys[j].toLowerCase()) >= 0.85) {
                endIndex = i;
                endfound = true;
                break;
              }
            }
          }
        }
        if (found && !endfound) {
          endIndex = i;
        }
      }
      SoftSkillSection = tokens.slice(startIndex + 1, endIndex + 1)


      //Get Experience Section
      startIndex = 0;
      endIndex = 0;
      found = false;
      endfound = false;
      for (let i = 0; i < tokens.length; i++) {
        let keys = tokens[i].split(' ');
        if (endfound) {
          break;
        }
        if (keys.length > 3) {
          continue;
        }
        if (!found) {
          if (stringSimilarity.compareTwoStrings('experience', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings('work experience', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("employment history", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("training", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("internships", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("responsiblities", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("Projects", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("Postions of Responsiblities", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }


        }
        else {
          if (keys.length > 3) {
            continue;
          }

          for (let j = 0; j < keys.length; j++) {
            if (endfound) {
              break;
            }
            for (let k = 0; k < endTokens.length; k++) {
              if (stringSimilarity.compareTwoStrings(endTokens[k], keys[j].toLowerCase()) >= 0.85) {
                endIndex = i;
                endfound = true;
                break;
              }
            }
          }
        }
        if (!endfound && i + 1 === tokens.length) {
          endIndex = i;
        }
      }
      ExperienceSection = tokens.slice(startIndex + 1, endIndex + 1)


      //Getting Projects Section
      startIndex = 0;
      endIndex = 0;
      found = false;
      endfound = false;
      for (let i = 0; i < tokens.length; i++) {
        let keys = tokens[i].split(' ');
        if (endfound) {
          break;
        }
        if (keys.length > 3) {
          continue;
        }
        if (!found) {
          if (stringSimilarity.compareTwoStrings('projects', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings('technical projects', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings('college projects', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings('university projects', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
        }
        else {
          if (keys.length > 3) {
            continue;
          }

          for (j = 0; j < keys.length; j++) {
            if (endfound) {
              break;
            }
            for (let k = 0; k < endTokens.length; k++) {
              if (stringSimilarity.compareTwoStrings(endTokens[k], keys[j].toLowerCase()) >= 0.85) {
                endIndex = i;
                endfound = true;
                break;
              }
            }
          }
        }
        if (!endfound && found) {
          endIndex = i;
        }
      }
      ProjectsSection = tokens.slice(startIndex + 1, endIndex + 1)


      //Getting Certifications
      startIndex = 0;
      endIndex = 0;
      found = false;
      endfound = false;
      for (let i = 0; i < tokens.length; i++) {
        let keys = tokens[i].split(' ');
        if (endfound) {
          break;
        }
        if (keys.length > 3) {
          continue;
        }
        if (!found) {
          if (stringSimilarity.compareTwoStrings('certifications', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings('accomplishments', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings('achievements', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings('nominations', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
        }
        else {
          if (keys.length > 3) {
            continue;
          }

          for (j = 0; j < keys.length; j++) {
            if (endfound) {
              break;
            }
            for (let k = 0; k < endTokens.length; k++) {
              if (stringSimilarity.compareTwoStrings(endTokens[k], keys[j].toLowerCase()) >= 0.85) {
                endIndex = i;
                endfound = true;
                break;
              }
            }
          }
        }
        if (found && !endfound) {
          endIndex = tokens.length - 1;
        }
      }
      CertificationSection = tokens.slice(startIndex + 1, endIndex + 1);

      //Getting Education Section
      startIndex = 0;
      endIndex = 0;
      found = false;
      endfound = false;
      for (let i = 0; i < tokens.length; i++) {
        let keys = tokens[i].split(' ');
        if (endfound) {
          break;
        }
        if (keys.length > 3) {
          continue;
        }
        if (!found) {
          if (stringSimilarity.compareTwoStrings('education', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          if (stringSimilarity.compareTwoStrings('academic background', tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("academics", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("schooling", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("studies", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }
          else if (stringSimilarity.compareTwoStrings("apprenticeship", tokens[i].toLowerCase()) >= 0.80) {
            startIndex = i;
            found = true;
          }

        }
        else {
          if (keys.length > 3) {
            continue;
          }

          for (j = 0; j < keys.length; j++) {
            if (endfound) {
              break;
            }
            for (let k = 0; k < endTokens.length; k++) {
              if (stringSimilarity.compareTwoStrings(endTokens[k], keys[j].toLowerCase()) >= 0.85) {
                endIndex = i;
                endfound = true;
                break;
              }
            }
          }
        }
        if (found && !endfound) {
          endIndex = i;
        }
      }
      EducationSection = tokens.slice(startIndex + 1, endIndex + 1);
      let Sections = { ProfileSections, SoftSkillSection, HardSkillSection, EducationSection, CertificationSection, ExperienceSection, ProjectsSection }

      setTimeout(()=>{
        let Score = GenerateScore(Sections, jobinfo);
        var user = new UsrJob({
          userId: uid,
          jobId: jid,
          resume: resumeLink,
          username: username,
          score: Score[0] ||0
        });
        user.save().then((doc) => {
          res.send(doc);
        }, e => {
          res.send(e)
        })
      },3000)
    });
  });
});

app.get('/getPostedJobs',(req,res)=>{
  let id = req.query.companyid;
  Jobs.find({ companyId:id.toString()},(err,docs)=>{
    if(err)
    {
      res.send(false);
    }
    else{
      res.send(docs);
    }
  })
})

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));
