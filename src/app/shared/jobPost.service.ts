
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import {jobPost} from './jobpost.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  job: jobPost= {
    Title  :'',
    companyId :'',
    description:'',
    location:'',
    skills:null,
    experience :'',
    degree:null,
    jobType:null,
    salary:'',
    datePosted :null,
    lastDateToApply:null

  };
  constructor(private http: HttpClient) { }
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };


  postJob(job: jobPost) {
    return this.http.post(environment.apiBaseUrl + '/PostJob', job,this.noAuthHeader);
  }

  getJobs(){
    return this.http.get(environment.apiBaseUrl + '/getJobs',this.noAuthHeader);

  }


}
