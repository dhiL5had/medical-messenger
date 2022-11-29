import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PatientService } from 'src/app/patient/patient.service';

import * as moment from 'moment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {

  isLoading:boolean = false;
  doctorsList:any;
  appForm!: FormGroup;
  mode:string = 'create';
  minDate: any;

  private appointmentId!:string;

  constructor(
    private formBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public appointmentData:any , 
    private dialogRef: MatDialogRef<DialogComponent>,
    private patientService: PatientService) {
    this.minDate = moment().format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.createForm();
    setTimeout(() => {
      this.patientService.getDoctorsList().subscribe(resData => {
        this.doctorsList = resData.doctors;
        this.isLoading = false;
      })
    }, 500);
  }

  createForm(): void {
    this.appForm = this.formBuilder.group({
      id: [''],
      description: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: [this.minDate, Validators.required],
      time: ['', Validators.required],
    });
  }

  createAppointment(){
    if (this.appForm.invalid) return this.appForm.markAllAsTouched();
    // console.log(this.appForm.value);
    this.appForm.patchValue({date: moment(this.appForm.value.date).format('YYYY-MM-DD')})
    this.isLoading = true;
    if(this.mode == 'create') {
      this.patientService.addAppointment(this.appForm.value);
      console.log(this.appForm.value);
    } else {
      this.patientService.updateAppointment(this.appForm.value);
    }
    this.appForm.reset();
    this.isLoading = false;
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

}
