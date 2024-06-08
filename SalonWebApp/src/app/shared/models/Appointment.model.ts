import { Person } from './Person.model';
import { Status } from './Enum/Status.enum';
import { AppointmentEmployeeTreatment } from './AppointmentEmployeeTreatment.model';

export interface Appointment {
  appointmentID: number;
  treatmentID: number;
  customer: Person;

  //TODO: check the format of the date.
  startDateTime: Date;
  endDateTime: Date;
  dateCreated: Date;

  approvalStatus: Status;
  employee: Person;
  appointmentEmployeeTreatments: AppointmentEmployeeTreatment[];

  treatmentName?: string;
  treatmentDescription?: string;
  treatmentPrice?: number;
}
