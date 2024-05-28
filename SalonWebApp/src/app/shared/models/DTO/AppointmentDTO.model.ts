import {PersonDTO} from "./PersonDTO.model";
import {Person} from "../Person.model";
import {Status} from "../Enum/Status.enum";

export interface AppointmentDTO {
  appointmentID: number;
  customer: Person;

  //TODO: check the format of the date.
  startDateTime: Date;
  endDateTime: Date;
  dateCreated: Date;

  approvalStatus: Status;
  employee: Person;
}
