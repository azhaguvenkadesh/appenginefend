import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../service/appointment.service';
import { Appointment } from '../model/appointment';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  loadAppointment(arg0: number) {
    throw new Error('Method not implemented.');
  }
  appointmentForm: FormGroup;
  isEditMode = false;
  successMessage: string = '';
  minDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.appointmentForm = this.formBuilder.group({
      id: [null],
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      specialization: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadAppointmentDetails(+id);
    }
  }

  private loadAppointmentDetails(id: number): void {
    this.appointmentService.getAppointment(id).subscribe(
      (appointment: Appointment) => this.appointmentForm.patchValue(appointment),
      error => console.error('Error fetching appointment', error)
    );
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) return;

    if (this.isEditMode) {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }
  }

  private updateAppointment(): void {
    const appointmentId = this.appointmentForm.value.id;
    this.appointmentService.updateAppointment(appointmentId, this.appointmentForm.value).subscribe(
      response => {
        this.successMessage = 'Appointment successfully updated';
        this.resetSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 2000);
      },
      error => console.error('Error updating appointment', error)
    );
  }
  
  private createAppointment(): void {
    this.appointmentService.createAppointment(this.appointmentForm.value).subscribe(
      response => {
        this.successMessage = 'Appointment successfully created';
        this.resetSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 2000);
      },
      error => console.error('Error creating appointment', error)
    );
  }

  private resetSuccessMessage(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 2000); // Hide the message after 2 seconds
  }
}