import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  NgbModal,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerComponent } from '../../dom-element/loading-spinner/loading-spinner.component';
import { Treatment } from '../../../shared/models/Treatment.model';
import { Status } from '../../../shared/models/Enum/Status.enum';
import { TreatmentService } from '../../../services/treatment.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Role } from '../../../shared/models/Enum/Role.enum';

declare global {
  interface Window {
    bootstrap: any;
  }
}

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
  private modalInstance: any;
  error?: string;
  pendingAppointmentsNumber?: number;
  approvedAppointmentsNumber?: number;
  declinedAppointmentsNumber?: number;
  expiredAppointmentsNumber?: number;

  @ViewChild('errorModalAppointment') errorModalAppointment: ElementRef;

  constructor(
    private appointmentService: AppointmentService,
    private treatmentService: TreatmentService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private modalService: NgbModal
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
      this.error = 'No user data found in local storage';
      this.openModal();
    }
  }

  loadAppointmentsWithTreatments(appointments: Appointment[]): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId;
      console.log('appointments fetched: ', appointments);
      if (this.role === 'CUSTOMER') {
        this.relevantAppointments = appointments.filter(
          (appointment) => appointment.customerId === userId
        );
        this.countAppointmentsNumbers();
      } else if (this.role === 'EMPLOYEE') {
        this.relevantAppointments = appointments.filter(
          (appointment) => appointment.employeeId === userId
        );
        this.countAppointmentsNumbers();
      } else if (this.role === 'ADMIN') {
        this.relevantAppointments = appointments;
      }
      this.countAppointmentsNumbers();
      console.log('Relevant appointments: ', this.relevantAppointments);
      if (this.relevantAppointments.length === 0) {
        this.error = 'We could not find any appointment.';
        this.openModal();
      }
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

  editAppointment(appointmentId: number): void {
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

  declineAppointment(appointmentId: number): void {
    console.log('Appointment id=', appointmentId);
    let toBeUpdatedAppointment = this.relevantAppointments.filter(
      (appointment) => appointment.appointmentId === appointmentId
    );
    console.log('appointment to be updated: ', toBeUpdatedAppointment);
    const appointmentData = {
      appointmentId: appointmentId,
      customerId: toBeUpdatedAppointment[0].customerId,
      startDateTime: toBeUpdatedAppointment[0].startDateTime,
      approvalStatus: Status.REJECTED,
      employeeId: toBeUpdatedAppointment[0].employeeId,
      treatmentId: toBeUpdatedAppointment[0].treatmentId,
    };

    console.log('appointment data to be sent: ', appointmentData);

    this.appointmentService.updateAppointment(appointmentData).subscribe({
      next: (appointment: Appointment) => {
        console.log('Appointment declined:', appointment);
        window.location.reload(); // Refresh the list after approval
      },
      error: (error) => {
        console.error('Error declining appointment:', error);
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

  openModal() {
    const modalElement = document.getElementById('errorModalAppointment');
    if (modalElement) {
      this.modalInstance = new window.bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  onCancel(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.error = null;
      this.router.navigate(['/']);
    }
  }

  onExit(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.error = null;
    }
  }

  countAppointmentsNumbers() {
    this.pendingAppointmentsNumber = this.countAppointmentsByStatus(
      Status.PENDING
    );
    this.approvedAppointmentsNumber = this.countAppointmentsByStatus(
      Status.APPROVED
    );
    this.declinedAppointmentsNumber = this.countAppointmentsByStatus(
      Status.REJECTED
    );
    this.expiredAppointmentsNumber = this.countAppointmentsByStatus(
      Status.EXPIRED
    );
  }

  countAppointmentsByStatus(status: Status): number {
    return this.relevantAppointments.filter(
      (appointment) => appointment.approvalStatus === status.toUpperCase()
    ).length;
  }

  hasPendingAppointments(): boolean {
    return this.pendingAppointmentsNumber > 0;
  }

  hasApprovedAppointments(): boolean {
    return this.approvedAppointmentsNumber > 0;
  }

  hasDeclinedAppointments(): boolean {
    return this.declinedAppointmentsNumber > 0;
  }

  hasExpiredAppointments(): boolean {
    return this.expiredAppointmentsNumber > 0;
  }

  ngOnDestroy() {
    this.appointmentSubscription.unsubscribe();
  }

  protected readonly Role = Role;
  protected readonly Status = Status;
}
