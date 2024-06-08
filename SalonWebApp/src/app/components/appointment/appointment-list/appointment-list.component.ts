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

  constructor(
    private appointmentService: AppointmentService,
    private treatmentService: TreatmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.appointmentSubscription =
      this.appointmentService.appointmentsChanged.subscribe(
        (appointments: Appointment[]) => {
          this.loadAppointmentsWithTreatments(appointments);
        }
      );

    this.loadAppointmentsWithTreatments(
      this.appointmentService.getAppointments()
    );
  }

  loadAppointmentsWithTreatments(appointments: Appointment[]): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId;

      const relevantAppointments = appointments.filter(
        (appointment) => appointment.customer.personId === userId
      );

      // Map over each appointment to create an observable that fetches the treatment
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

      // Combine all observables to ensure all treatments are fetched before updating the view
      forkJoin(appointmentsWithTreatments).subscribe((combinedAppointments) => {
        this.filteredAppointments = combinedAppointments;
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
