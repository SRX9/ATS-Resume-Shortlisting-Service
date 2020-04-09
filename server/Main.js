const express  = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.port||3000;
const app=express();
const fs = require('fs');
const pdf = require('pdf-parse');
let stringSimilarity = require('string-similarity');
let {GenerateScore} =require('./Ultilities');

app.use(bodyParser.json());
app.use(cors());


app.get('/getit',(req,res)=>{

    //Job applicant
    let username ="aaa";

    //Job Information
    let jobinfo={
        skills: [".NET","Coding","Programming", "Angular", "C#","python", "TypeScript","Programming","Data Structures","algorithms", "Mysql","html","css", "Javascript"],
        title: "Software Engineer",
        experience: "1+ year experince in .NET and Angular and in Databases Mysql, javasccript and aslo good in handling  and with python an django along with html,css and bootsrap",
        descritpion : "we need Problem solver, enthusiastic and fast learners for our software development team.",
        degree: "Bachelors of technology in Computer Engineering or related work fields.",
    }



    let Resumes=[
                    {
                        candidate:"Soham",
                        reusme:'./Resumes/rohan.pdf'
                    },
                    {
                        candidate:"Rohan Patel",
                        reusme:'./Resumes/sohan.pdf'
                    },
                    {
                        candidate:"Raj Patel",
                        reusme:'./Resumes/a.pdf'
                    },
                    {
                        candidate:"AL Gorithm",
                        reusme:'./Resumes/Al Gorithm.pdf'
                    },
                    {
                        candidate:"Savaliya Raj",
                        reusme:'./Resumes/b.pdf'
                    },
                    {
                        candidate:"SWATI BARARIA",
                        reusme:'./Resumes/c.pdf'
                    },
                    {
                        candidate:"Cocoa Touch",
                        reusme:'./Resumes/Cocoa Touch.pdf'
                    },
                    {
                        candidate: "Shiksha Jaiswal",
                        reusme: './Resumes/d.pdf'
                    },
                    {
                        candidate: "Deep shah",
                        reusme: './Resumes/deep.pdf'
                    },
                    {
                        candidate: "Sachin",
                        reusme: './Resumes/e.pdf'
                    },
                    {
                        candidate: "Vivek Korat",
                        reusme: './Resumes/f.pdf'
                    },
                    {
                        candidate: "Jigneshkumar Parmar",
                        reusme: './Resumes/g.pdf'
                    },
                    {
                        candidate: "Huzaifa Mankda",
                        reusme: './Resumes/j.pdf'
                    },
                    {
                        candidate: "Khantil Sanghani",
                        reusme: './Resumes/k.pdf'
                    },
                    {
                        candidate: "May Trix",
                        reusme: './Resumes/May Trix.pdf'
                    },
                    {
                        candidate: "Megan Chin Sook Ling",
                        reusme: './Resumes/p.pdf'
                    },
                    {
                        candidate: "John Dee",
                        reusme: './Resumes/p.pdf'
                    },
                    {
                        candidate: "Jainam Trivedi",
                        reusme: './Resumes/jainam.pdf'
                    },
                    {
                        candidate: "Akabari Raj",
                        reusme: './Resumes/rajakabari.pdf'
                    },
                ]
    //Extracting Data from Pdf
    let Results=[];
    for(let i=0; i< Resumes.length;i++)
    {
        let dataBuffer = fs.readFileSync(Resumes[i].reusme);

        //Generating Tokens ans Sections
        let endTokens = [Resumes[i].candidate, "summary","FIELD OF INTEREST", "career objective", "top skills", "objective", "Activities", "courses", "course work", "personal info",
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
            let Score = GenerateScore(Sections, jobinfo);

            Results.push({
                name:Resumes[i].candidate,
                points:Score[0]
            })
        });
    }
    setTimeout(()=>{
        function compare(a, b) {
            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            return 0;
        }
        Results.sort(compare);
        let t=Results[0].points+25;
        for(let i=0;i<Results.length;i++)
        {
            let percent = Number.parseFloat(Results[i].points * (100 / t)).toPrecision(4);
            Results[i].Percent_Matched=percent+"%";
        }
        res.send(Results);
    },3000);
});

app.listen(port,()=>{
    console.log("Server's live babe!!!");
});
