import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { loggedInGuard } from './services/logged-in.guard';
import { authGuard } from './services/auth.guard';
import { adminGuard } from './services/admin.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminOverviewComponent } from './components/admin/admin-overview/admin-overview.component';
import { AdminApprovalsComponent } from './components/admin/admin-approvals/admin-approvals.component';
import { AdminUserManagementComponent } from './components/admin/admin-user-management/admin-user-management.component';
import { AdminEventManagementComponent } from './components/admin/admin-event-management/admin-event-management.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { AdminQaManagementComponent } from './components/admin/admin-qa-management/admin-qa-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [loggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [loggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loggedInGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [loggedInGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: 'dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [authGuard] },
   { path: 'my-events', component: MyEventsComponent, canActivate: [authGuard] }, 
  { path: 'admin/dashboard', component: AdminDashboardComponent,canActivate: [adminGuard],
    
   children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'approvals', component: AdminApprovalsComponent },
      { path: 'users', component: AdminUserManagementComponent },
      { path: 'events', component: AdminEventManagementComponent },
      { path: 'questions', component: AdminQaManagementComponent }, // <-- ADD THIS NEW ROUTE
    ]
  },

  { path: '**', redirectTo: '' }
];