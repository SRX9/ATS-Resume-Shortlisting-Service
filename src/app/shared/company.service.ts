
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import {Company} from './company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  selectedCompany: Company= {
    name: '',
    email: '',
    description: '',
    type: '',
    password: '',

  };
  constructor(private http: HttpClient) { }
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };


  postCompany(company: Company) {
    return this.http.post(environment.apiBaseUrl + '/registercmp', company,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/authenticatecmp', authCredentials, this.noAuthHeader);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }
  getCompanyPayload() {
    const token = this.getToken();
    if (token) {
      const companyPayload = atob(token.split('.')[1]);
      return JSON.parse(companyPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    const companyPayload = this.getCompanyPayload();
    if (companyPayload) {
      return companyPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  getCompanyProfile() {
    return this.http.get(environment.apiBaseUrl + '/companyProfile');
  }


}
