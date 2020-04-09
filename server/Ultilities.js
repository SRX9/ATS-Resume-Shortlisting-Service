let stringSimilarity = require('string-similarity');

function GenerateScore(section, jobinfo) {
    let scoreObtained=0;


    //***1***. Skills Score Generator
    let reqSkills = jobinfo.skills.map(v => v.toLowerCase());
    let resumeSkills = section.HardSkillSection;
    let pureSkills = [];
    let pureSkillsWithSpace = [];

    //without spaces between skill word
    resumeSkills.map(skillstoken => {
        let tokenskills = skillstoken.split(',').join(' ').split('|').join(' ').split('/');
        if (tokenskills.count < 5) {
            pureSkills.push(skillstoken);
        }
        else {
            tokenskills.map(tokens => {
                pureSkills.push(tokens);
            });
        }
    });
    //with space net skills word
    resumeSkills.map(skillstoken => {
        let tokenskills = skillstoken.split(',').join(' ').split('|').join(' ').split('/').join(' ').split(' ');
        if (tokenskills.count < 5) {
            pureSkills.push(skillstoken);
        }
        else {
            tokenskills.map(tokens => {
                pureSkills.push(tokens);
            });
        }
    })


    let skillsMatched=[];
    pureSkills.map(skill => {
        var result = stringSimilarity.findBestMatch(skill.toLowerCase(),reqSkills)
        if(result.bestMatch.rating > 0.80)
        {
            skillsMatched.push(result.bestMatch.target);
        }
    });

    //in case of same skills written more than one time
    let finalMatchedSkills = skillsMatched.filter(function (elem, pos) {
        return skillsMatched.indexOf(elem) == pos;
    })
    scoreObtained+=finalMatchedSkills.length*20;


    //***2*** Experience Score Calculating = Candidate's experience matching wiht req experience
    let reqExpTokens = jobinfo.experience.split(" ").map(v => v.toLowerCase());
    let l=reqExpTokens.length;
    let k=0;
    let s = "";
    for(let i=0;i<l;i++)
    {
        if(k<3)
        {
            s=s+reqExpTokens[i]+" ";
            k++;
        }
        else{
            k=0;
            reqExpTokens.push(s);
            s="";
        }
    }
    let expSkill=[];
    let expCadSkills=[];
    let CandidateExpirenceToken=section.ExperienceSection.join(" ").split(" ");
    CandidateExpirenceToken.map(skillstoken => {
        let tokenskills = skillstoken.split(',').join(' ').split('|').join(' ').split('/').join(' ').split(' '); ;
        if (tokenskills.count < 5) {
            expCadSkills.push(skillstoken);
        }
        else {
            tokenskills.map(tokens => {
                expCadSkills.push(tokens);
            });
        }
    });
    // 1. Generating  experience score
    expCadSkills.map(skill =>{
        var result = stringSimilarity.findBestMatch(skill.toLowerCase(), reqExpTokens)
        if (result.bestMatch.rating > 0.80) {
            expSkill.push(result.bestMatch.target);
        }
    });
    // 2. Generating projects score
    expCadSkills.map(skill => {
        var result = stringSimilarity.findBestMatch(skill.toLowerCase(), reqExpTokens)
        if (result.bestMatch.rating > 0.80) {
            expSkill.push(result.bestMatch.target);
        }
    });

    let finalMatchedExperieced = expSkill.filter(function (elem, pos) {
        return expSkill.indexOf(elem) == pos;
    });

    let t1=[];
    let t2=[];
    let reqSkillsInExperience=0;
    reqExpTokens.map(skill =>{
        let temp=stringSimilarity.findBestMatch(skill.toLowerCase(), reqSkills);
        if (temp.bestMatch.rating>0.80)
        {   t1.push(temp.bestMatch.target);
            reqSkillsInExperience++;
        }
    });
    let foundSkillInExperience=0;
    finalMatchedExperieced.map(skill => {
        let temp = stringSimilarity.findBestMatch(skill.toLowerCase(), reqSkills);
        if (temp.bestMatch.rating > 0.80) {
            t2.push(temp.bestMatch.target);
            foundSkillInExperience++;
        }
    });
    scoreObtained+=((foundSkillInExperience/reqSkillsInExperience)*50)

    //***3*** Calculating Job Title Score
    let candexp = CandidateExpirenceToken;
    let s1="";
    let c=0;
    for(let i=0; i<CandidateExpirenceToken.length; i++)
    {
        if(c<jobinfo.title.split(" ").length)
        {
            s1+=CandidateExpirenceToken[i]+" ";
            c++;
        }
        else{
            candexp.push(s1);
            s1="";
            c=0;
        }
    }
    for(let h=0;h<candexp.length;h++)
    {
        let temp = stringSimilarity.compareTwoStrings(candexp[h].toLowerCase(), jobinfo.title);
        if (temp> 0.6) {
            scoreObtained += 20;
            break;
        }
    }

    //***4*** Calculating Certification Score
    let CertificationTokens = section.CertificationSection.join(" ").split(" ").map(v => v.toLowerCase());
    CertificationTokens.map(token => {
        let temp = stringSimilarity.findBestMatch(token.toLowerCase(), reqSkills);
        if(temp.bestMatch.rating>0.75)
        {
            scoreObtained+=5;
        }
    });

    //***5*** Calculating Education/Degree Score
    let EducationToken = section.EducationSection.join(" ").split(" ").map(v => v.toLowerCase());
    let reqEducationToken = jobinfo.degree.join(" ").split(" ").map(v => v.toLowerCase());
    EducationToken.map(token => {
        let temp = stringSimilarity.findBestMatch(token.toLowerCase(),reqEducationToken);
        if (temp.bestMatch.rating > 0.75) {
            console.log(temp.bestMatch.target)
            scoreObtained += 2;
        }
    })

    //***6*** Calculating Softskills Score
    let Softskills = section.SoftSkillSection.join(" ").split(" ").map(v => v.toLowerCase());
    let profileTokens=section.ProfileSections.join(" ").split(" ").map(v => v.toLowerCase());
    Softskills=Softskills.concat(profileTokens);
    let reqSoft=jobinfo.descritpion.split(" ").map(v => v.toLowerCase());
    Softskills.map(token => {
        let temp = stringSimilarity.findBestMatch(token.toLowerCase(), reqSoft);
        if (temp.bestMatch.rating > 0.75) {
            console.log(temp.bestMatch.target)
            scoreObtained += 1;
        }
    });

    return [scoreObtained];
}


module.exports={ GenerateScore:GenerateScore }
