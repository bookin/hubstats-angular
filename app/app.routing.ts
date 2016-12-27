import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { DashboardComponent } from './dashboard.component';

import { AuthGuard } from './auth.guard';


const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: ':username', component: DashboardComponent, canActivate: [AuthGuard] }
];

export const Routing =  RouterModule.forRoot(routes);