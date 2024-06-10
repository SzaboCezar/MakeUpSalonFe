import { Person } from './Person.model';
import { Treatment } from './Treatment.model';

export interface EmployeeTreatment {
  employeeTreatmentsID?: number;
  // employee: Person;
  // treatment: Treatment;
  employeeID: number;
  treatmentID: number;
}
