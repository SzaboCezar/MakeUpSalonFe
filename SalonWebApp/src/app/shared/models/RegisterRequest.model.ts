export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;

  //TODO: check the format of the date.
  dateOfBirth: Date;

  address: string;
  pictureURL: string;

}
