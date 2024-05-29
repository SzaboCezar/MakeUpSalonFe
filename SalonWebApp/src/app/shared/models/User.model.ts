import {Role} from "./Enum/Role.enum";
import {Person} from "./Person.model";
import {AuthenticationResponse} from "./AuthenticationResponse.model";

export class User {
  constructor(
      public userId: number,
      public email: string,
      public password: string,
      public role: Role,
      public person: Person,
      public accountNonExpired: boolean,
      public accountNonLocked: boolean,
      public credentialsNonExpired: boolean,
      public enabled: boolean,


      //Need for authentication. The question mark tells TypeScript that this property may be undefined.
      private _token?: AuthenticationResponse
    ) {}

  get token() {
    if (!this._token) {
      return null;
    }
    return this._token;
  }
}
