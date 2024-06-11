import { Person } from './Person.model';
import { Treatment } from './Treatment.model';

export interface EmployeeTreatment {
  employeeTreatmentsId?: number;
  // employee: Person;
  // treatment: Treatment;
  employeeID: number;
  treatmentID: number;
}
