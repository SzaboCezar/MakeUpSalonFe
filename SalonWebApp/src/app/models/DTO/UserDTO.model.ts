import {PersonDTO} from "./PersonDTO.model";

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
