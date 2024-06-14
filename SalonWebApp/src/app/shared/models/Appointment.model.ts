import { Person } from './Person.model';
import { Status } from './Enum/Status.enum';
import { AppointmentEmployeeTreatment } from './AppointmentEmployeeTreatment.model';

export interface Appointment {
  appointmentId: number;
  treatmentId?: number;
  customer?: Person;
  customerId?: number;
  employeeId?: number;
  customerFirstName?: string;
  customerLastName?: string;

  //TODO: check the format of the date.
  startDateTime?: string;
  endDateTime?: string;
  dateCreated?: string;

  approvalStatus?: Status;
  employee?: Person;
  appointmentEmployeeTreatments?: AppointmentEmployeeTreatment[];

  treatmentName?: string;
  treatmentDescription?: string;
  treatmentPrice?: number;
}
