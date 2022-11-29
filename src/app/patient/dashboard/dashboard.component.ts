import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AppointmentData } from '../appointment-data.model';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  appointments: AppointmentData[] = [];
  isLoading: boolean = false;
  userId: any;

  constructor(private patientService: PatientService, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.userId = this.authService.getUserId();
      this.patientService.getAppointment().subscribe(appointData => {
        console.log(appointData);
        this.appointments = [...appointData.appointments];
        this.isLoading = false;
      });
    }, 3000)
  }

  addNewAppointment() {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'dialog-side-panel',
      width: '350px',
      maxWidth: '100vw',
      height: '100%',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(result);
    });
  }

}
