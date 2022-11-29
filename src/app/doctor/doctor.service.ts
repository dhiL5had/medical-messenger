import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
const API_URL = environment.baseUrl + '/doctor';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private http:HttpClient, private router: Router) { }

  getPatientsList() {
    return this.http.get<{message: string, patients: any}>(API_URL + '/patients');
  }

  pinPatient(patientId: string) {
    return this.http.get(API_URL + '/patients/' + patientId);
  }
}