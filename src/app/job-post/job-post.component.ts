import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {JobPostService} from '../shared/jobPost.service';
import {jobPost} from '../shared/jobpost.model';
import { from } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.css']
})




export class JobPostComponent implements OnInit {
  constructor(private job: JobPostService) {  }
  Title = '';
  Description = '';
Location = '';
salary = '';
Start_Date = '';
End_date = '';
Experiance = '';
degrees = new FormControl();
employeement_types = new FormControl();
skills = new FormControl();
employeement_typeList: string[] = ['Intern', 'Full TIme', 'Part Time'];
skillList: string[] = ['C#', 'c', 'java', 'python', 'Django', '.NET',
 '.NET MVC', 'Data Structures', 'Algorithms', 'Networking', 'ML', 'AI'
 , 'BigData', 'Hadoop', 'MongoDb', 'Node', 'React', 'MEAN Stack','Active Listening',
'Adaptability',
'Communication',
'Creativity',
'Critical Thinking',
'Customer Service',
'Decision Making',
'Interpersonal Communication',
'Management',
'Leadership',
'Organization',
'Public Speaking',
'Problem-solving',
'Teamwork',
'Data Entry',
'Answering Phones',
'Billing',
'Scheduling',
'MS Office',
'Office Equipment',
'QuickBooks',
'Shipping' ,
'Welcoming Visitors',
'Salesforce',
'Calendar Management',
'Open Source Experience',
'CodingJava Script',
'Security',
'Machine Learning',
'Debugging',
'UX/UI',
'Front-End & Back-End Development',
'Cloud Management',
'Agile Development'];

  degreeList: string[] = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.E.', 'M.E.'];

  showSucessMessage: boolean;
  serverErrorMessages: string;



  ngOnInit() {
  }
  jobPost() {
    console.log(localStorage.getItem('cmpid').toString())
    var regJob: jobPost={
      Title  :this.Title,
      companyId :localStorage.getItem('cmpid').toString(),
      description:this.Description,
      location:this.Location,
      skills:this.skills.value,
      experience :this.Experiance,
      degree:this.degrees.value,
      jobType:this.employeement_types.value,
      salary:this.salary,
      datePosted :new Date(this.Start_Date),
      lastDateToApply:new Date(this.End_date)

    };
    this.job.postJob(regJob).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.Title = '';
        this.Description = '';

        this.Location = '';
        this.salary = '';
        this.Start_Date = '';
        this.End_date = '';
        this.Experiance = '';
        this.degrees = new FormControl();
        this.employeement_types = new FormControl();
        this.skills = new FormControl();



      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
  }
}
