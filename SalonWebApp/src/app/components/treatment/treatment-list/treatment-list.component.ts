import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Treatment } from '../../../shared/models/Treatment.model';
import { TreatmentService } from '../../../services/treatment.service';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, forkJoin, catchError, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NavBarComponent } from '../../dom-element/nav-bar/nav-bar.component';
import { LoadingSpinnerComponent } from '../../dom-element/loading-spinner/loading-spinner.component';
import { PersonService } from '../../../services/person.service';
import { Person } from '../../../shared/models/Person.model';
import { Location } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { EmployeeTreatmentService } from '../../../services/employee-treatment.service';
import { EmployeeTreatment } from '../../../shared/models/EmployeeTreatment.model';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../shared/models/Appointment.model';

declare global {
  interface Window {
    bootstrap: any;
  }
}

@Component({
  selector: 'app-treatment-list',
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
  templateUrl: './treatment-list.component.html',
  styleUrl: './treatment-list.component.scss',
})
export class TreatmentListComponent implements OnInit, OnDestroy {
  treatmentSubscription: Subscription;
  appointmentSubscription: Subscription;
  selectedTreatment?: Treatment;
  employeeTreatments?: EmployeeTreatment[] = [];
  relevantAppointments: Appointment[] = [];
  treatments: Treatment[];
  appointments: Appointment[] = [];
  selectedEmployeeTreatments: { [key: number]: Person[] } = {};
  error: string = null;
  private modalInstance: any;
  isEmployee: boolean = false;

  @ViewChild('errorModal') errorModal: ElementRef;

  constructor(
    private treatmentService: TreatmentService,
    private appointmentService: AppointmentService,
    private personService: PersonService,
    private employeeTreatmentService: EmployeeTreatmentService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private ngZone: NgZone,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkRole();

    this.appointmentSubscription =
      this.appointmentService.appointmentsChanged.subscribe(
        (appointments: Appointment[]) => {
          this.appointments = appointments;
        }
      );

    this.appointmentService.getAppointments();

    this.treatmentSubscription =
      this.treatmentService.treatmentsChanged.subscribe(
        (treatments: Treatment[]) => {
          this.treatments = treatments;
          this.selectedTreatment =
            treatments.length > 0 ? treatments[0] : undefined; // Setare primul tratament din listă ca fiind selectat sau undefined dacă nu există niciun tratament
        }
      );

    this.treatments = this.treatmentService.getTreatments();
    if (this.treatments.length > 0) {
      this.selectedTreatment = this.treatments[0]; // Setare primul tratament din listă ca fiind selectat sau undefined dacă nu există niciun tratament
    }
    console.log('treatments: ', this.treatments);
    this.initializeEmployeeTreatments();
  }

  loadAppointmentsWithTreatments(
    appointments: Appointment[],
    treatmentId: number
  ): Observable<Appointment[]> {
    this.relevantAppointments = appointments.filter(
      (appointment) => appointment.treatmentId === treatmentId
    );
    console.log('Relevant appointments: ', this.relevantAppointments);
    return of(this.relevantAppointments);
  }

  initializeEmployeeTreatments(): void {
    console.log('treatments: ', this.treatments);
    const treatmentObservables = this.treatments.map((treatment) => {
      const employeeObservables = treatment.employeeIds.map((id) =>
        this.personService.getPersonById(id)
      );

      return forkJoin(employeeObservables).pipe(
        map((employees: Person[]) => ({
          treatmentID: treatment.treatmentID,
          employees: employees,
        }))
      );
    });

    forkJoin(treatmentObservables).subscribe(
      (results) => {
        results.forEach((result) => {
          this.selectedEmployeeTreatments[result.treatmentID] =
            result.employees;
        });
        console.log('treatments: ', this.treatments);
        console.log('selected employees: ', this.selectedEmployeeTreatments);
      },
      (error) => {
        console.error('Error initializing employee treatments', error);
      }
    );
  }

  onSelect(treatment: Treatment): void {
    this.selectedTreatment = treatment;
    this.treatmentService.getTreatment(treatment.treatmentID);
  }

  fetchEmployeeTreatments(treatmentId: number): Observable<void> {
    return this.employeeTreatmentService.fetchEmployeeTreatments().pipe(
      switchMap((employeeTreatments) => {
        const employeeTreatmentsToDelete = employeeTreatments.filter(
          (et) => et.treatmentID === treatmentId
        );
        console.log('EMPLOYEE TREATMENTS FETCH: ', employeeTreatmentsToDelete);
        if (employeeTreatmentsToDelete.length === 0) {
          return of(null); // If no employee treatments, skip deletion
        }
        const deleteEmployeeTreatmentObservables =
          employeeTreatmentsToDelete.map((et) =>
            this.employeeTreatmentService.deleteEmployeeTreatment(
              et.employeeTreatmentsId
            )
          );
        return forkJoin(deleteEmployeeTreatmentObservables).pipe(
          map(() => void 0)
        );
      })
    );
  }

  onConfirm(treatmentId: number): void {
    if (this.selectedTreatment) {
      this.fetchEmployeeTreatments(this.selectedTreatment.treatmentID)
        .pipe(
          switchMap(() => this.appointmentService.fetchAppointments()), // Fetch all appointments
          switchMap((appointments) =>
            this.loadAppointmentsWithTreatments(appointments, treatmentId)
          ), // Filter relevant appointments
          switchMap((relevantAppointments) => {
            if (relevantAppointments.length === 0) {
              return of(null); // If no appointments, skip deletion
            }
            const deleteAppointmentObservables = relevantAppointments.map(
              (appointment) =>
                this.appointmentService.deleteAppointment(
                  appointment.appointmentId
                )
            );
            return forkJoin(deleteAppointmentObservables);
          }),
          switchMap(() => {
            // Delete the treatment only after the employee treatments and appointments have been deleted
            return this.treatmentService.deleteTreatment(
              this.selectedTreatment.treatmentID
            );
          }),
          catchError((error) => {
            this.error = error.message;
            this.openModal(); // Open the error modal
            return of(null); // Return an empty observable to prevent the error from propagating to subscribers
          })
        )
        .subscribe(() => {
          this.error = null; // Reset the error to null
          this.router.navigate(['/treatments']); // Navigate to the treatments page
        });
    }
  }

  openModal() {
    const modalElement = document.getElementById('errorModal');
    if (modalElement) {
      this.modalInstance = new window.bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  onCancel(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.error = null;
    }
  }

  handleImageError(event): void {
    // Dacă imaginea specificată în treatment.pictureUrl nu poate fi încărcată, afișăm imaginea de rezervă
    event.target.src = 'assets/img/HomePage/RealisticMakeup.png';
  }

  checkRole() {
    this.isEmployee = this.authService.isEmployee();
  }

  ngOnDestroy() {
    this.treatmentSubscription.unsubscribe();
  }
}
