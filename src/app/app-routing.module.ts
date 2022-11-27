import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard]},
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
