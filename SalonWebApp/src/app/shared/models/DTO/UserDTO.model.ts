import {PersonDTO} from "./PersonDTO.model";
import {Role} from "../Enum/Role.enum";

export interface UserDTO {
  userId: number;
  email: string;
  password: string;
  role: Role;
  personDto: PersonDTO;

  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}
