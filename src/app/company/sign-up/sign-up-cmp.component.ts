
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { CompanyService } from '../../shared/company.service';
import axios from 'axios';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up-cmp.component.html',
  styleUrls: ['./sign-up-cmp.component.css'],
  providers: [CompanyService]
})
export class SignUpCmpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  fileToUpload : File = null;
  constructor(private companyService: CompanyService, private router: Router) { }
  handleFile(files:FileList)
  {
    this.fileToUpload = files.item(0);
  }
  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log('inside on submit');
    console.log(form.value);
    var bodyFormData = new FormData();
    bodyFormData.append('img',this.fileToUpload);
    bodyFormData.append('type',this.companyService.selectedCompany.type);
    bodyFormData.append('name',this.companyService.selectedCompany.name);
    bodyFormData.append('email',this.companyService.selectedCompany.email);
    bodyFormData.append('description',this.companyService.selectedCompany.description);
    bodyFormData.append('password',this.companyService.selectedCompany.password);
    axios.put('http://localhost:4000/imgsignup',bodyFormData).then(res=>{
      console.log(res.data);
      this.router.navigateByUrl('/logincmp');
     // window.alert('uploaded Successfully');
    }).catch(e=>{
      console.log(e)
    })

    /*this.companyService.postCompany(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('hihi<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );*/
  }

  resetForm(form: NgForm) {
    this.companyService.selectedCompany = {
      name: '',
      email: '',
      description: '',
      type: '',
      password: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

}
