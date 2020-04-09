import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CompanyService } from '../app/shared/company.service';
import {UserService} from '../app/shared/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private companyService: CompanyService, private router: Router,private userService:UserService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        if (req.headers.get('noauth')) {
            return next.handle(req.clone());
        } else if(req.url == '/companyProfile'){
            const clonedreq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this.companyService.getToken())
            });
            return next.handle(clonedreq).pipe(
                tap(
                    event => { },
                    err => {
                        // tslint:disable-next-line: triple-equals
                        if (err.error.auth == false) {
                            this.router.navigateByUrl('/logincmp');
                        }
                    })
            );
        }
        else {
          const clonedreq = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + this.userService.getToken())
          });
          return next.handle(clonedreq).pipe(
              tap(
                  event => { },
                  err => {
                      // tslint:disable-next-line: triple-equals
                      if (err.error.auth == false) {
                          this.router.navigateByUrl('/login');
                      }
                  })
          );
      }
    }
}
