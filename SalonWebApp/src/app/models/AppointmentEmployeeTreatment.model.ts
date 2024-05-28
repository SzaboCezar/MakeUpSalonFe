import {Appointment} from "./Appointment.model";
import {EmployeeTreatment} from "./EmployeeTreatment.model";

export interface AppointmentEmployeeTreatment {

  appointmentEmployeeTreatmentsID: number;
  appointment: Appointment;
  employeeTreatment: EmployeeTreatment;

}
