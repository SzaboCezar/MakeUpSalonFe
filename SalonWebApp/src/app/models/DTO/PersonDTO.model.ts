export interface PersonDTO {
  personId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  //TODO: check the format of the date.
  dateOfBirth: Date;

  address: string;
  pictureURL: string;

  // publicUserDto: PublicUserDto;

  employeeTreatments: EmployeeTreatment[];
  customerAppointments: Appointment[];
  employeeAppointments: Appointment[];
}
