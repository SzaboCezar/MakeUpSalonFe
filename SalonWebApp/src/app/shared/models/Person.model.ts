import {Appointment} from "./Appointment.model";
import {EmployeeTreatment} from "./EmployeeTreatment.model";
import {User} from "./User.model";

export interface Person {
  personId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  //TODO: check the format of the date.
  dateOfBirth: Date;

  address: string;
  pictureURL: string;
  user: User;
  employeeTreatments: EmployeeTreatment[];
  customerAppointments: Appointment[];
  employeeAppointments: Appointment[];

}
