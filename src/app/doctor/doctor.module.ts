import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AngularMaterialModule } from '../angular-material.module';


@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    DoctorRoutingModule
  ]
})
export class DoctorModule { }
