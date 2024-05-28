export interface TreatmentDTO {

  treatmentID: number;
  name: string;
  description: string;
  estimatedDuration: number;
  price: number;
  pictureURL: string;
  employeeTreatments: EmployeeTreatment[];

}
