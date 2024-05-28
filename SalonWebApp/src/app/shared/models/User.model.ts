import {Role} from "./Enum/Role.enum";
import {Person} from "./Person.model";

export interface User {
  userId: number;
  email: string;
  password: string;
  role: Role;
  person: Person;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}
