import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.baseUrl + '/patient/appointments/';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http:HttpClient, private router: Router) { }

  getDoctorsList() {
    return this.http.get<{message: string; doctors: any}>(environment.baseUrl + '/patient/doctors');
  }

  getAppointment() {
    return this.http.get<{
      message: string, appointments: any
    }>(API_URL)
    .pipe(map((appData) => {
      return {
        appointments: appData.appointments?.map((apps:any) => {
          return {
            id: apps._id,
            description: apps.description,
            doctor: apps.doctor,
            date: apps.date,
            time: apps.time,
            roomId: apps.roomId
          }
        })
      }
    }))
  };

addAppointment(data: any) {
  this.http.post(API_URL, data)
    .subscribe((resData) => {
      this.router.navigate(['/patient/dashboard']);
    });
  }

  updateAppointment(data:any) {
    this.http
      .patch(API_URL, data)
      .subscribe((response) => {
        this.router.navigate(['/patient/dashboard']);
      });
  }
}