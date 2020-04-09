import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { UserService } from "../../shared/user.service";
import { UserService } from '../shared/user.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private router:Router,private userService:UserService) { }

  ngOnInit() {
  }

}
