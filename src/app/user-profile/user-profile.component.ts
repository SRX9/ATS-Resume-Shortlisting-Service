import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import {JobPostService} from '../shared/jobPost.service'
import { Router } from '@angular/router';
import axios from 'axios';
import { tokenReference } from '@angular/compiler';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  jobDetails;
  alljobs:boolean;
  applyButton:boolean;
  constructor(private userService: UserService, private router: Router,private jobPostService: JobPostService) { }
  job;
  setJob(i:number)
  {
    this.alljobs=false;
    this.job =this.jobDetails[i];
  }
  applyJob()
  {
    console.log(this.fileToUpload)
    var bodyFormData = new FormData();
    bodyFormData.append('resume',this.fileToUpload);
    bodyFormData.append('name',localStorage.getItem("name"));
    bodyFormData.append('jobid',this.job._id.toString());
    bodyFormData.append('userid',localStorage.getItem("userid"));
    axios.put('http://localhost:4000/applyJob',bodyFormData).then(res=>{
      console.log(res.data);
      this.alljobs=true;
      this.applyButton=false;
     // window.alert('uploaded Successfully');
    }).catch(e=>{
      console.log(e)
    })
  }

  fileToUpload:File;
  handleFile(files:FileList)
  {
    this.applyButton=true;
    this.fileToUpload = files.item(0);
  }
  ngOnInit() {
    // console.log(Token)
    if (!this.userService.isLoggedIn())
      this.router.navigateByUrl("/login");
    /*if(localStorage.getItem('id')===null)
    {
      this.router.navigateByUrl('/login');
    }*/
    this.alljobs=true;
    this.applyButton=false;
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res["user"];
        localStorage.setItem('userid',this.userDetails._id);
        localStorage.setItem('name',this.userDetails.firstName+" "+this.userDetails.lastName);
        localStorage.setItem('cmpid',this.userDetails._id);
      },
      err => {
        console.log(err);

      }
    );
    this.jobPostService.getJobs().subscribe(
      res => {
        this.jobDetails = res["jobs"];
        console.log(this.jobDetails);
      },
      err => {
        console.log(err);

      }
    );

  }

  onLogout() {
    this.userService.deleteToken();
    localStorage.setItem('cmpid','');
    localStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

}
