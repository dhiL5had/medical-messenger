import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DocAuthGuard } from '../auth/guards/doc-role.guard';
import { ChatComponent } from '../components/chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, DocAuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard, DocAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, DocAuthGuard]
})
export class DoctorRoutingModule { }
