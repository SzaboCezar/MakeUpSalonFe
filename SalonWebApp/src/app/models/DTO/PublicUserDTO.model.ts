import {PersonDTO} from "./PersonDTO.model";

export interface PublicUserDTO {
  userId: number;
  email: string;
  role: Role;
  personDto: PersonDTO;
}
