import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DoctorService } from '../doctor.service';
import { PatientsData } from '../patients-data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  patients: PatientsData[] = [];
  isLoading: boolean = false;

  displayedColumns: string[] = ['id', 'name', 'email', 'action1', 'action2'];
  dataSource!: MatTableDataSource<PatientsData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private doctorService: DoctorService) { }

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
      console.log(data);
      this.ngOnInit();
    },
    err => {
      console.log(err);
    })
    this.isLoading = false;
  }

  chat(patientId: string) {
    console.log(patientId);
  }

}
