import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../shared/company.service';
import { Router } from '@angular/router';
import Axios from 'axios';
// import { CompanyService } from '../shared/company.service';
@Component({
  selector: "app-company-profile",
  templateUrl: "./company-profile.component.html",
  styleUrls: ["./company-profile.component.css"]
})
export class CompanyProfileComponent implements OnInit {
  companyDetails;
  postedJobs;
  job;
  visibleAll: boolean;
  userResumes;
  constructor(private companyService: CompanyService, private router: Router) {}
  setJob(i: number) {
    this.job = this.postedJobs[i];
    this.visibleAll = false;
    console.log(this.job._id)
    Axios.get("http://localhost:4000/getCandidates", {
        params: {
          jobid: this.job._id
        }
      })
      .then((response)=> {
         this.visibleAll = false;
        this.userResumes = response.data;
        console.log(response.data);
      })
      .catch((error)=> {
        console.log(error);
      })
  }
  ngOnInit() {
    if(!this.companyService.isLoggedIn()){
    this.router.navigateByUrl("/login");
  }
    this.visibleAll = true;
    this.companyService.getCompanyProfile().subscribe(
      res => {
        this.companyDetails = res["company"];
        localStorage.setItem("cmpid", this.companyDetails._id);
        Axios.get("http://localhost:4000/getPostedJobs", {
          params: {
            companyid: this.companyDetails._id
          }
        })
          .then(response => {
            this.postedJobs = response.data;
            console.log(response.data);
          })
          .catch(function(error) {
            console.log(error);
          });

        console.log(localStorage.getItem("cmpid"));
        console.log(this.companyDetails);
      },
      err => {
        console.log(err);
      }
    );
  }

  gotoresume=(url)=>{
    window.open("http://localhost:4000"+url, "_blank");

  }

  onLogout() {
    this.companyService.deleteToken();
    this.router.navigate(["/logincmp"]);
  }
}
