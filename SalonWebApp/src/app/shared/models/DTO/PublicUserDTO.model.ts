import {PersonDTO} from "./PersonDTO.model";
import {Role} from "../Enum/Role.enum";

export interface PublicUserDTO {
  userId: number;
  email: string;
  role: Role;
  personDto: PersonDTO;
}
