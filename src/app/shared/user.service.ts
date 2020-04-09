import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Candidate } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: Candidate = {

    firstName :'',
    lastName :'',
    DOB :'',
    contact: '',
    degree:'',
    institute:'',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient) { }
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };

  postUser(user: Candidate) {
      return this.http.post(environment.apiBaseUrl + '/register', user, this.noAuthHeader);
    }

  login(authCredentials) {
      return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials, this.noAuthHeader);
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
  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

getUserProfile() {
  return this.http.get(environment.apiBaseUrl + '/userProfile');
}
}
