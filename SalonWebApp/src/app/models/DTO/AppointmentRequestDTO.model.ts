import {PersonDTO} from "./PersonDTO.model";
import {Status} from "../Enum/Status.enum";

export interface AppointmentRequestDTO {
  customerId: number;

  //TODO: check the format of the date.
  startDateTime: Date;

  approvalStatus: Status;
  employeeId: number;
  treatmentId: number;
}
