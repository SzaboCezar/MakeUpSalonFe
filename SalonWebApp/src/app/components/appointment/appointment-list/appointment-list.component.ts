import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavBarComponent } from '../../dom-element/nav-bar/nav-bar.component';
import { Subscription } from 'rxjs';
import { Appointment } from '../../../shared/models/Appointment.model';
import { AppointmentService } from '../../../services/appointment.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerComponent } from '../../dom-element/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    DatePipe,
    NgbAccordionDirective,
    NgbAccordionItem,
    RouterLink,
    CommonModule,
    NgbAccordionBody,
    NgbAccordionCollapse,
    NgbAccordionButton,
    NgbAccordionHeader,
    NavBarComponent,
    NgbTooltip,
    LoadingSpinnerComponent,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  appointmentSubscription: Subscription;
  selectedAppointment?: Appointment;
  appointments: Appointment[];
  filteredAppointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.appointmentSubscription =
      this.appointmentService.appointmentsChanged.subscribe(
        (appointments: Appointment[]) => {
          this.appointments = appointments;
          this.filterAppointmentsByCustomerId();
        }
      );

    this.appointments = this.appointmentService.getAppointments();
    console.log('Appointments: ' + this.appointments);
    this.filterAppointmentsByCustomerId();
  }

  filterAppointmentsByCustomerId(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId;
      this.filteredAppointments = this.appointments.filter(
        (appointment) => appointment.customer.personId === userId
      );
      console.log('Filtered appointments:', this.filteredAppointments); // Debugging log
    } else {
      console.error('No user data found in local storage');
    }
  }

  onSelect(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    // this.selectedEmployeeTreatments = treatment.employeeTreatments;
    this.appointmentService.getAppointment(appointment.appointmentID);
  }

  ngOnDestroy() {
    this.appointmentSubscription.unsubscribe();
  }
}
