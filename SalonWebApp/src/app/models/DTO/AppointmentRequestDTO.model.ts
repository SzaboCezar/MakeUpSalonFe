import {PersonDTO} from "./PersonDTO.model";

export interface AppointmentRequestDTO {
  customerId: number;

  //TODO: check the format of the date.
  startDateTime: Date;

  approvalStatus: Status;
  employeeId: number;
  treatmentId: number;
}
