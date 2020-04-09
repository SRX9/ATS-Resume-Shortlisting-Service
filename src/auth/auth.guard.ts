
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../app/shared/user.service';

import { Router } from '@angular/router';
import { CompanyService } from '../app/shared/company.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService,private companyService: CompanyService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!this.userService.isLoggedIn()) {
        this.router.navigateByUrl('/login');
        this.userService.deleteToken();
        return false;
      }
      if (!this.companyService.isLoggedIn()) {
        this.router.navigateByUrl('/logincmp');
        this.userService.deleteToken();
        return false;
      }

      return true;
  }
}
