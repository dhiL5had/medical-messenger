import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

  constructor(
    private patientService: PatientService, 
    private authService: AuthService, 
    private dialog: MatDialog,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.userId = this.authService.getUserId();
      this.patientService.getAppointment().subscribe(appointData => {
        this.appointments = [...appointData.appointments];
        this.isLoading = false;
      });
    }, 500)
  }

  addNewAppointment() {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'dialog-side-panel',
      width: '350px',
      maxWidth: '100vw',
      height: '100%',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      this.ngOnInit();
    });
  }

  chat(roomId: string, doctor: string) {
    this.router.navigateByUrl('/patient/chat', {state: { roomId, user: doctor }});
  }

}
