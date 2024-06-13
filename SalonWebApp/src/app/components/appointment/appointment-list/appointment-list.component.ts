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
import { TreatmentService } from '../../../services/treatment.service';

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
  treatments: Treatment[];
  treatment: Treatment;
  role: string;

  constructor(
    private appointmentService: AppointmentService,
    private treatmentService: TreatmentService,
    private route: ActivatedRoute
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

      let relevantAppointments: Appointment[] = [];

      if (this.role === 'CUSTOMER') {
        relevantAppointments = appointments.filter(
          (appointment) => appointment.customerId === userId
        );
      } else if (this.role === 'EMPLOYEE') {
        relevantAppointments = appointments.filter(
          (appointment) => appointment.employeeId === userId
        );
      } else if (this.role === 'ADMIN') {
        relevantAppointments = appointments;
      }

      console.log('Relevant appointments: ', relevantAppointments);

      const appointmentsWithTreatments = relevantAppointments.map(
        (appointment) =>
          this.treatmentService.getTreatment(appointment.treatmentID).pipe(
            map((treatment) => ({
              ...appointment,
              treatmentName: treatment.name,
              treatmentDescription: treatment.description,
              treatmentPrice: treatment.price,
            })),
            catchError((error) => {
              console.error('Error fetching treatment', error);
              return of({ ...appointment }); // Return the appointment without treatment details on error
            })
          )
      );

      forkJoin(appointmentsWithTreatments).subscribe((combinedAppointments) => {
        this.filteredAppointments = combinedAppointments;
        console.log('Filtered appointments: ', this.filteredAppointments);
      });
    }
  }

  onSelect(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  ngOnDestroy() {
    this.appointmentSubscription.unsubscribe();
  }
}
