import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavBarComponent } from '../../dom-element/nav-bar/nav-bar.component';
import { Subscription, forkJoin, of } from 'rxjs';
import { Appointment } from '../../../shared/models/Appointment.model';
import { AppointmentService } from '../../../services/appointment.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
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
import { Treatment } from '../../../shared/models/Treatment.model';
import { Status } from '../../../shared/models/Enum/Status.enum';
import { TreatmentService } from '../../../services/treatment.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  relevantAppointments: Appointment[] = [];
  treatments: Treatment[];
  treatment: Treatment;
  role: string;

  constructor(
    private appointmentService: AppointmentService,
    private treatmentService: TreatmentService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.role = parsedUserData.role;

      this.appointmentSubscription =
        this.appointmentService.appointmentsChanged.subscribe(
          (appointments: Appointment[]) => {
            this.loadAppointmentsWithTreatments(appointments);
          }
        );

      this.loadAppointmentsWithTreatments(
        this.appointmentService.getAppointments()
      );
    } else {
      console.error('No user data found in local storage');
    }
  }

  loadAppointmentsWithTreatments(appointments: Appointment[]): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId;

      if (this.role === 'CUSTOMER') {
        this.relevantAppointments = appointments.filter(
          (appointment) => appointment.customerId === userId
        );
      } else if (this.role === 'EMPLOYEE') {
        this.relevantAppointments = appointments.filter(
          (appointment) => appointment.employeeId === userId
        );
      } else if (this.role === 'ADMIN') {
        this.relevantAppointments = appointments;
      }

      console.log('Relevant appointments: ', this.relevantAppointments);
    }
  }

  approveAppointment(appointmentId: number): void {
    console.log('Appointment id=', appointmentId);
    let toBeUpdatedAppointment = this.relevantAppointments.filter(
      (appointment) => appointment.appointmentId === appointmentId
    );
    console.log('appointment to be updated: ', toBeUpdatedAppointment);
    const appointmentData = {
      appointmentId: appointmentId,
      customerId: toBeUpdatedAppointment[0].customerId,
      startDateTime: toBeUpdatedAppointment[0].startDateTime,
      approvalStatus: Status.APPROVED,
      employeeId: toBeUpdatedAppointment[0].employeeId,
      treatmentId: toBeUpdatedAppointment[0].treatmentId,
    };

    console.log('appointment data to be sent: ', appointmentData);

    this.appointmentService.updateAppointment(appointmentData).subscribe({
      next: (appointment: Appointment) => {
        console.log('Appointment approved:', appointment);
        window.location.reload(); // Refresh the list after approval
      },
      error: (error) => {
        console.error('Error approving appointment:', error);
      },
    });
  }

  onSelect(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  onConfirm(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId).subscribe({
      next: () => {
        console.log('Appointment deleted successfully.');
        // Perform any additional actions like refreshing the appointment list
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting appointment:', error);
      },
    });
  }

  ngOnDestroy() {
    this.appointmentSubscription.unsubscribe();
  }
}
