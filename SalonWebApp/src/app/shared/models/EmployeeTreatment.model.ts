import {Person} from "./Person.model";
import {Treatment} from "./Treatment.model";

export interface EmployeeTreatment {
  employeeTreatmentsID: number;
  gemployee: Person;
  treatment: Treatment;
}
