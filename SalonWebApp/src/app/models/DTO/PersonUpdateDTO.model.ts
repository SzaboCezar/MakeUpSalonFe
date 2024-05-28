export interface PersonUpdateDTO {
  personId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  //TODO: check the format of the date.
  dateOfBirth: Date;

  address: string;
  pictureURL: string;
}
