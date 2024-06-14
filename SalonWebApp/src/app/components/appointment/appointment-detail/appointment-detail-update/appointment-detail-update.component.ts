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
import { Observable, Subscription, forkJoin } from 'rxjs';
import { IntervalDTO } from '../../../../shared/models/DTO/IntervalDTO.model';
import { Status } from '../../../../shared/models/Enum/Status.enum';

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
  selectedEmployee: Person;

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
    console.log(
      'appointment employee id is ++++ ',
      this.appointment.employeeId
    );
    this.getEmployee(this.appointment.employeeId);

    this.appointmentForm.get('date')?.valueChanges.subscribe((date) => {
      this.availableTimes = this.getAvailableTimes(date);
    });

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
      this.fetchUnavailableTimes(this.appointment.employeeId);
    });
  }

  getEmployee(employeeId: number): void {
    this.personService.getPersonById(employeeId).subscribe(
      (employee: Person) => {
        const employeeName = `${employee.firstName} ${employee.lastName}`;
        this.appointmentForm?.get('employee')?.setValue(employeeName);
        console.log('Selected employee:', employeeName);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching employee details', error);
        this.appointmentForm?.get('employee')?.setValue('');
        this.cdr.detectChanges();
      }
    );
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
    }
  }

  async fetchPersonFromLocalStorage(): Promise<void> {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.userId;
      this.email = parsedUserData.email;
      this.appointmentForm.get('email')?.setValue(this.email);
    } else {
      console.error('No user data found in local storage');
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
    const appointmentId = this.appointment.appointmentId;
    const customerId = this.appointment.customerId;
    const startDate = this.appointmentForm.get('date')?.value;
    const startTime = this.appointmentForm.get('time')?.value;
    const startDateTime = moment(
      `${startDate} ${startTime}`,
      'YYYY-MM-DD HH:mm'
    ).format('YYYY-MM-DD HH:mm:ss');

    const employeeId = this.appointment.employeeId;
    const treatmentId = this.appointment.treatmentId;
    const approvalStatus = Status.PENDING;

    const updatedAppointment = {
      appointmentId,
      customerId,
      startDateTime,
      employeeId: +employeeId,
      approvalStatus,
      treatmentId: +treatmentId,
    };

    this.appointmentService.updateAppointment(updatedAppointment).subscribe(
      (appointment: Appointment) => {
        console.log('Appointment updated successfully:', appointment);
        this.successMessage = 'Appointment updated successfully!';
        this.logService.add(
          `AppointmentDetailUpdateComponent: updated ${appointment.appointmentId}`
        );
        this.router.navigate(['/my-appointments']);
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
