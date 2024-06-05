import { Component, OnInit, OnDestroy } from '@angular/core';
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

// declare var moment: any;

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
  treatmentSubscription: Subscription;
  appointmentForm: FormGroup;
  unavailableTimes = [
    { start: '2024-06-10T10:00:00', end: '2024-06-10T11:00:00' },
    { start: '2024-06-11T14:00:00', end: '2024-06-11T15:30:00' },
  ];
  treatments: Treatment[];

  availableTimes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private treatmentService: TreatmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      appointmentFor: ['', Validators.required],
    });

    this.appointmentForm.get('date')?.valueChanges.subscribe((date) => {
      this.availableTimes = this.getAvailableTimes(date);
    });

    this.treatmentSubscription =
      this.treatmentService.treatmentsChanged.subscribe(
        (treatments: Treatment[]) => {
          this.treatments = treatments;
          console.log('treatments: ', this.treatments); // Ensure treatments are logged correctly
        }
      );

    // Fetch treatments from the API and set the initial treatments
    this.treatmentService.fetchTreatments().subscribe({
      next: (treatments) => {
        console.log('Fetched treatments:', treatments);
      },
      error: (error) => {
        console.error('Error fetching treatments:', error);
      },
    });
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

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      console.log(this.appointmentForm.value);
      // Perform your form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnDestroy() {
    this.treatmentSubscription.unsubscribe();
  }
}
