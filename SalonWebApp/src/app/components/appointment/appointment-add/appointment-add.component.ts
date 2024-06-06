import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../dom-element/nav-bar/nav-bar.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import moment from 'moment';
import { Treatment } from '../../../shared/models/Treatment.model';
import { TreatmentService } from '../../../services/treatment.service';
import { Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from '../../dom-element/loading-spinner/loading-spinner.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeTreatment } from '../../../shared/models/EmployeeTreatment.model';
import { Person } from '../../../shared/models/Person.model';
import { PersonService } from '../../../services/person.service';
import { IntervalDTO } from '../../../shared/models/DTO/IntervalDTO.model';

@Component({
  selector: 'app-appointment-add',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css'],
})
export class AppointmentAddComponent implements OnInit, OnDestroy {
  appointmentForm: FormGroup;

  treatmentSubscription: Subscription;
  unavailableSubscription: Subscription;
  treatments: Treatment[];
  selectedEmployeeTreatments: Person[] = [];
  employeeTreatments: EmployeeTreatment[] = [];
  unavailableTimes: IntervalDTO[] = [];
  availableTimes: string[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private treatmentService: TreatmentService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      appointmentFor: ['', Validators.required],
      employee: ['', Validators.required],
    });

    this.appointmentForm.get('date')?.valueChanges.subscribe((date) => {
      this.availableTimes = this.getAvailableTimes(date);
    });

    this.appointmentForm
      .get('appointmentFor')
      ?.valueChanges.subscribe((treatmentID) => {
        this.updateEmployeeDropdown(treatmentID);
      });

    this.fetchAllTreatments();
  }

  fetchAllTreatments(): void {
    this.treatmentSubscription = this.treatmentService
      .fetchTreatments()
      .subscribe({
        next: (treatments) => {
          this.treatments = treatments;
          this.extractEmployeeTreatments(treatments);
          this.isLoading = false; // Update loading state
          this.cdr.detectChanges(); // Manually trigger change detection
          console.log('Fetched treatments:', treatments);
        },
        error: (error) => {
          console.error('Error fetching treatments:', error);
        },
      });
  }

  fetchUnavailableTimes(employeeId: number): void {
    this.unavailableSubscription = this.personService
      .getUnavailableTimes(employeeId)
      .subscribe({
        next: (intervals: IntervalDTO[]) => {
          this.unavailableTimes = intervals.map((interval) => ({
            start: new Date(interval.start),
            end: new Date(interval.end),
          }));
          console.log('Fetched unavailable times:', this.unavailableTimes); // Debugging log
          this.cdr.detectChanges(); // Manually trigger change detection
        },
        error: (error) => {
          console.error('Error fetching unavailable times:', error);
        },
      });
  }

  extractEmployeeTreatments(treatments: Treatment[]): void {
    this.employeeTreatments = treatments.flatMap(
      (treatment) => treatment.employeeTreatments
    );
    console.log('Extracted employee treatments:', this.employeeTreatments);
  }

  updateEmployeeDropdown(treatmentId: number): void {
    const selectedTreatment = this.treatments.find(
      (treatment) => treatment.treatmentID === treatmentId
    );
    if (selectedTreatment) {
      this.selectedEmployeeTreatments =
        selectedTreatment.employeeTreatments.map((et) => et.employee);
      console.log('Selected employees:', this.selectedEmployeeTreatments);
    } else {
      this.selectedEmployeeTreatments = [];
    }
    this.cdr.detectChanges();
  }

  isTimeUnavailable(time: string, date: string): boolean {
    const selectedTime = moment(`${date}T${time}`);
    return this.unavailableTimes.some((unavailable) => {
      const startTime = moment(unavailable.start);
      const endTime = moment(unavailable.end);
      return selectedTime.isBetween(startTime, endTime, undefined, '[)');
    });
  }

  getAvailableTimes(date: string): string[] {
    const times: string[] = [];
    const startTime = moment(date).startOf('day');
    const endTime = moment(date).endOf('day');
    while (startTime.isBefore(endTime)) {
      const timeStr = startTime.format('HH:mm');
      if (!this.isTimeUnavailable(timeStr, date)) {
        times.push(timeStr);
      }
      startTime.add(30, 'minutes');
    }
    return times;
  }

  onSelectTreatment(event: Event): void {
    const treatmentId = (event.target as HTMLSelectElement).value;
    console.log('Selected Treatment ID:', treatmentId); // Debugging log
    this.updateEmployeeDropdown(+treatmentId);
  }

  onSelectEmployee(event: Event): void {
    const employeeId = (event.target as HTMLSelectElement).value;
    console.log('Selected Employee ID:', employeeId); // Debugging log
    this.fetchUnavailableTimes(+employeeId);
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      console.log(this.appointmentForm.value);
      // Perform your form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnDestroy() {
    if (this.treatmentSubscription) {
      this.treatmentSubscription.unsubscribe();
    }
    if (this.unavailableSubscription) {
      this.unavailableSubscription.unsubscribe();
    }
  }
}
