import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment.service';
import { LogsService } from '../../../../logs/logs.service';
import { Location, NgIf, NgForOf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Appointment } from '../../../../shared/models/Appointment.model';
import { PersonService } from '../../../../services/person.service';
import { TreatmentService } from '../../../../services/treatment.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import moment from 'moment';
import { NavBarComponent } from '../../../dom-element/nav-bar/nav-bar.component';
import { Person } from '../../../../shared/models/Person.model';
import { Subscription, forkJoin } from 'rxjs';
import { IntervalDTO } from '../../../../shared/models/DTO/IntervalDTO.model';

@Component({
  selector: 'app-appointment-detail-update',
  standalone: true,
  imports: [
    NgIf,
    NavBarComponent,
    NgForOf,
    RouterLink,
    NgbTooltip,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './appointment-detail-update.component.html',
  styleUrl: './appointment-detail-update.component.css',
})
export class AppointmentDetailUpdateComponent implements OnInit {
  appointment?: Appointment;
  personSubscription: Subscription;
  appointmentForm?: FormGroup;
  treatments = [];
  selectedEmployeeId: number | null = null;
  successMessage: string = '';
  today: string;
  person: Person | null = null;
  email: String = '';
  unavailableSubscription: Subscription;
  unavailableTimes: IntervalDTO[] = [];
  availableTimes: string[] = [];
  selectedEmployeeTreatments: Person[] = [];

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private treatmentService: TreatmentService,
    private location: Location,
    private logService: LogsService,
    private personService: PersonService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.appointmentForm = this.fb.group({
    //   name: [{value: '', disabled: true}, Validators.required],
    //   email: [
    //     {value: '', disabled: true},
    //     [Validators.required, Validators.email],
    //   ],
    //   date: ['', Validators.required],
    //   time: ['', Validators.required],
    //   appointmentFor: ['', Validators.required],
    //   employee: ['', Validators.required],
    // });

    this.appointmentForm = new FormGroup({
      name: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      appointmentFor: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      employee: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
    });

    this.today = moment().format('YYYY-MM-DD');
    this.getAppointment();

    // this.appointmentForm
    //   .get('appointmentFor')
    //   ?.valueChanges.subscribe((treatmentID) => {
    //     this.updateEmployeeDropdown(treatmentID);
    //   });

    this.fetchPersonFromLocalStorage();
  }

  getAppointment(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.appointmentService.getAppointment(id).subscribe((appointment) => {
        this.appointment = appointment;
        console.log('APPOINT FETCHED IS: ', this.appointment);
        this.populateForm(appointment);
      });
      this.fetchUnavailableTimes(+id);
    });
  }

  updateEmployeeDropdown(treatmentId: number): void {
    const selectedTreatment = this.treatments.find(
      (treatment) => treatment.treatmentID === treatmentId
    );
    if (selectedTreatment) {
      const employeeObservables = selectedTreatment.employeeIds.map((id) =>
        this.personService.getPersonById(id)
      );

      forkJoin(employeeObservables).subscribe(
        (employees: Person[]) => {
          this.selectedEmployeeTreatments = employees;
          console.log('Selected employees:', this.selectedEmployeeTreatments);
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching employee details', error);
          this.selectedEmployeeTreatments = [];
          this.cdr.detectChanges();
        }
      );
    } else {
      this.selectedEmployeeTreatments = [];
      this.cdr.detectChanges();
    }
  }

  populateForm(appointment: Appointment): void {
    if (appointment) {
      this.appointmentForm
        ?.get('name')
        ?.setValue(
          `${appointment.customerFirstName} ${appointment.customerLastName}`
        );
      this.appointmentForm
        ?.get('appointmentFor')
        ?.setValue(appointment.treatmentName);
      this.appointmentForm?.get('employee')?.setValue(appointment.employeeId);
      this.appointmentForm
        ?.get('date')
        ?.setValue(moment(appointment.startDateTime).format('YYYY-MM-DD'));
      this.appointmentForm.get('date')?.valueChanges.subscribe((date) => {
        this.availableTimes = this.getAvailableTimes(date);
      });
    }
  }

  async fetchPersonFromLocalStorage(): Promise<void> {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId;
      this.email = parsedUserData.email;
      this.personSubscription = this.personService
        .getPersonById(userId)
        .subscribe({
          next: (person: Person) => {
            this.person = person;
            console.log('Fetched person:', this.person); // Debugging log
            this.setFormValues();
            this.cdr.detectChanges(); // Manually trigger change detection
          },
          error: (error) => {
            console.error('Error fetching person:', error);
          },
        });
    } else {
      console.error('No user data found in local storage');
    }
  }

  setFormValues(): void {
    if (this.person) {
      // this.appointmentForm
      //   .get('name')
      //   ?.setValue(`${this.person.firstName} ${this.person.lastName}`);
      this.appointmentForm.get('email')?.setValue(this.email);
    }
  }

  fetchUnavailableTimes(employeeId: number): void {
    this.unavailableSubscription = this.personService
      .getUnavailableTimes(employeeId)
      .subscribe({
        next: (intervals: IntervalDTO[]) => {
          console.log('intervals: ', intervals);
          this.unavailableTimes = intervals.map((interval) => ({
            start: moment({
              year: interval.start[0],
              month: interval.start[1] - 1, // Month should be zero-indexed
              day: interval.start[2],
              hour: interval.start[3],
              minute: interval.start[4],
            }).toDate(),
            end: moment({
              year: interval.end[0],
              month: interval.end[1] - 1, // Month should be zero-indexed
              day: interval.end[2],
              hour: interval.end[3],
              minute: interval.end[4],
            }).toDate(),
          }));
          console.log('Fetched unavailable times:', this.unavailableTimes); // Debugging log
          this.cdr.detectChanges(); // Manually trigger change detection
        },
        error: (error) => {
          console.error('Error fetching unavailable times:', error);
        },
      });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    const startDate = this.appointmentForm.get('date')?.value;
    const startTime = this.appointmentForm.get('time')?.value;
    const startDateTime = moment(
      `${startDate} ${startTime}`,
      'YYYY-MM-DD HH:mm'
    ).format('YYYY-MM-DD HH:mm:ss');

    const updatedAppointment = {
      ...this.appointment,
      startDateTime,
    };

    this.appointmentService.updateAppointment(null).subscribe(
      (appointment: Appointment) => {
        console.log('Appointment updated successfully:', appointment);
        this.successMessage = 'Appointment updated successfully!';
        this.logService.add(
          `AppointmentDetailUpdateComponent: updated ${appointment.appointmentId}`
        );
        this.router.navigate(['/appointments']);
      },
      (error) => {
        console.error('Error while updating appointment:', error);
        this.logService.add(
          `Error updating appointment ${this.appointment?.appointmentId}`
        );
      }
    );
  }

  isTimeUnavailable(time: string, date: string): boolean {
    const selectedTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    return this.unavailableTimes.some((unavailable) => {
      const startTime = moment(unavailable.start);
      const endTime = moment(unavailable.end);
      return selectedTime.isBetween(startTime, endTime, undefined, '[)');
    });
  }

  getAvailableTimes(date: string): string[] {
    const times: string[] = [];
    const today = moment().format('YYYY-MM-DD');

    let startTime = moment(date).startOf('day');

    if (date === today) {
      // If today, start from the current hour
      startTime = moment()
        .add(30 - (moment().minute() % 30), 'minutes')
        .startOf('minute');
    } else {
      startTime = moment(date).set({
        hour: 8,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    }

    const limitTime = moment(date).set({
      hour: 21,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    // const endTime = moment(date).endOf('day');
    while (startTime.isBefore(limitTime)) {
      const timeStr = startTime.format('HH:mm');
      if (!this.isTimeUnavailable(timeStr, date)) {
        times.push(timeStr);
      }
      startTime.add(30, 'minutes');
    }
    return times;
  }

  onCancel(): void {
    this.location.back();
  }
}
