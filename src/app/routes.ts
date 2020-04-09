import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from '../auth/auth.guard';
import {AuthInterceptor} from '../auth/auth.interceptor';

import { CompanyComponent } from './company/company.component';
import { SignUpCmpComponent } from './company/sign-up/sign-up-cmp.component';
import { SignInCmpComponent } from './company/sign-in/sign-in-cmp.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { JobPostComponent } from './job-post/job-post.component';

export const appRoutes: Routes = [
    {
        path: 'signup', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: '', component: UserComponent,
        children: [{ path: '', component:SignInComponent }]
    },
    {
      path: 'login', component: UserComponent,
      children: [{ path: '', component: SignInComponent }]
    },
    {
      path: 'userprofile', component: UserProfileComponent, canActivate: [AuthGuard]
    },
    {
      path: 'signupcmp', component: CompanyComponent,
      children: [{ path: '', component: SignUpCmpComponent }]
    },
    {
      path: 'logincmp', component: CompanyComponent,
      children: [{ path: '', component: SignInCmpComponent }]
    },
    {
      path: 'companyprofile', component: CompanyProfileComponent, canActivate: [AuthGuard]
    },
    {
      path: 'jobPost', component: JobPostComponent,canActivate: [AuthGuard]
    },

];
