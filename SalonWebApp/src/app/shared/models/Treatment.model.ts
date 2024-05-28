import {EmployeeTreatment} from "./EmployeeTreatment.model";

export interface Treatment {

  treatmentID: number;
  name: string;
  description: string;
  estimatedDuration: number;
  price: number;
  pictureURL: string;
  employeeTreatments: EmployeeTreatment[];

}
