import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../service/appointment.service';
import { Appointment } from '../model/appointment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
  providers: [DatePipe] // Provide DatePipe
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  successMessage: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private datePipe: DatePipe // Inject DatePipe
  ) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments(): void {
    this.appointmentService.getAppointments().subscribe((data) => {
      this.appointments = data.map(appointment => ({
        ...appointment,
        appointmentDate: this.datePipe.transform(appointment.appointmentDate, 'dd-MM-yyyy') // Format date
      }));
    });
  }

  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.successMessage = 'Appointment successfully deleted';
      this.getAppointments();
      setTimeout(() => this.successMessage = '', 2000); // Clear message after 3 seconds
    });
  }
}