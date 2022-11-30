import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DoctorService } from '../doctor.service';
import { PatientsData } from '../patients-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  patients: PatientsData[] = [];
  isLoading: boolean = false;

  displayedColumns: string[] = ['id', 'name', 'email','date', 'time', 'action1', 'action2'];
  dataSource!: MatTableDataSource<PatientsData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.doctorService.getPatientsList().subscribe(data => {
        const patients = data.patients.sort((a:any, b:any) => b.pinned - a.pinned)
        this.dataSource = new MatTableDataSource(patients);
        this.dataSource.paginator = this.paginator;
        this.patients = patients;
        this.isLoading = false;
      })
    }, 500)
  }

  pinPatient(patientId: string) {
    this.isLoading = true;
    this.doctorService.pinPatient(patientId).subscribe(data => {
      this.ngOnInit();
    },
    (err:any) => {
      console.log(err);
    })
    this.isLoading = false;
  }

  chat(roomId: string, patient: string) {
    this.router.navigateByUrl('/doctor/chat', {state: { roomId, user: patient  }});
  }

}
