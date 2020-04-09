import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../shared/company.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in-cmp.component.html',
  styleUrls: ['./sign-in-cmp.component.css']
})
export class SignInCmpComponent implements OnInit {

  constructor(private companyService: CompanyService,private router : Router) { }

  model ={
    email :'',
    password:''
  };
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  serverErrorMessages: string;
  ngOnInit() {
    if(this.companyService.isLoggedIn())
    {
      this.router.navigateByUrl('/companyprofile');
    }
  }

  onSubmit(form : NgForm){
    this.companyService.login(form.value).subscribe(
      res => {
        this.companyService.setToken(res['token']);
        this.router.navigateByUrl('/companyprofile');
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );
  }

}
