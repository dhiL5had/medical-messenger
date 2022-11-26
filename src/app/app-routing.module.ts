import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './doctor/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'doctor', loadChildren: () => import('./doctor/doctor.module').then((m) => m.DoctorModule) },
  { path: 'patient', loadChildren: () => import('./patient/patient.module').then((m) => m.PatientModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
