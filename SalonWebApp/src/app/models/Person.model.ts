export interface Person {
  persinId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  //TODO: check the format to be yyyy-MM-dd.
  dateOfBirth: Date;

  address: string;

  pictureURL: string;

  user: User;

  employeeTreatments: EmployeeTreatment[];

  customerAppointments: Appointment[];

  employeeAppointments: Appointment[];
}


