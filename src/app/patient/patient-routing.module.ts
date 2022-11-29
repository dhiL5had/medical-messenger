import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PatAuthGuard } from '../auth/guards/pat-role.guard';
import { ChatComponent } from '../components/chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, PatAuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard, PatAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, PatAuthGuard]
})
export class PatientRoutingModule { }
