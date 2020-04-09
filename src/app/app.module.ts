import { BrowserModule } from '@angular/platform-browser';
import { NgModule, forwardRef } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ReactiveFormsModule  } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';

import {MatButtonModule} from '@angular/material/button';

import {MatSelectModule} from '@angular/material/select';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component'; // <--
import { UserService } from './shared/user.service';
import { CompanyService } from './shared/company.service';
import {JobPostService} from './shared/jobPost.service'
import {appRoutes} from './routes';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { CompanyComponent } from './company/company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { SignUpCmpComponent } from './company/sign-up/sign-up-cmp.component';
import { SignInCmpComponent } from './company/sign-in/sign-in-cmp.component';
import { JobPostComponent } from './job-post/job-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    SignInComponent,
    UserProfileComponent,
    CompanyComponent,
    CompanyProfileComponent,
    SignUpCmpComponent,
    SignInCmpComponent,
    JobPostComponent
  ],
  imports: [
    BrowserModule,MatCardModule,
    HttpClientModule, MatStepperModule, ReactiveFormsModule, MatTabsModule, MatSelectModule, BrowserAnimationsModule,
  FormsModule, MatInputModule, HttpClientModule, MatButtonModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,

  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard, UserService, CompanyService,JobPostService ],
  bootstrap: [AppComponent]
})

export class AppModule { }
