import { Routes } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ExcersisesComponent } from './excersise/excersises/excersises.component';
import { FriendsComponent } from './user/friends/friends.component';
import { AdminComponent } from './admin/admin.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'excersises', component: ExcersisesComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/panel', component: AdminPanelComponent },
];
