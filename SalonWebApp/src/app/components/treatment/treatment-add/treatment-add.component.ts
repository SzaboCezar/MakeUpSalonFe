import { Component, OnInit } from '@angular/core';
import { Treatment } from '../../../shared/models/Treatment.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { TreatmentService } from '../../../services/treatment.service';
import { LogsService } from '../../../logs/logs.service';
import { Location, NgForOf, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeTreatment } from '../../../shared/models/EmployeeTreatment.model';
import { LoadingSpinnerComponent } from '../../dom-element/loading-spinner/loading-spinner.component';
import { EmployeeTreatmentService } from '../../../services/employee-treatment.service';
import { UserService } from '../../../services/user.service';
import { PersonService } from '../../../services/person.service';
import { User } from '../../../shared/models/User.model';
import { Person } from '../../../shared/models/Person.model';
import { forkJoin } from 'rxjs';
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-treatment-add',
  styleUrls: ['./treatment-add.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent, NgIf, NgForOf, NgbTooltip, RouterLink],
  templateUrl: './treatment-add.component.html',
})
export class TreatmentAddComponent implements OnInit {
  treatment?: Treatment = {
    treatmentID: null,
    name: null,
    description: null,
    estimatedDuration: null,
    price: null,
    pictureUrl: null,
    employeeIds: null,
  };

  addTreatmentForm: FormGroup;
  employeeTreatments?: EmployeeTreatment[] = [];
  employees: Person[] = [];

  constructor(
    private route: ActivatedRoute,
    private treatmentService: TreatmentService,
    private logService: LogsService,
    private location: Location,
    private employeeTreatmentService: EmployeeTreatmentService,
    private userService: UserService,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.addTreatmentForm = new FormGroup({
      // treatmentID: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      estimatedDuration: new FormControl(null),
      price: new FormControl(null),
      pictureUrl: new FormControl(null),
      employeeTreatments: new FormControl(null),
      employeeId: new FormControl(null),
    });

    this.userService.getUsersByRole('EMPLOYEE').subscribe((users: User[]) => {
      const personObservables = users.map((user) =>
        this.personService.getPersonById(user.userId)
      );
      forkJoin(personObservables).subscribe((persons: Person[]) => {
        this.employees = persons;
      });
    });
  }

  onAdd(): void {
    if (this.addTreatmentForm.invalid) {
      return;
    }

    const treatmentData = {
      name: this.addTreatmentForm.get('name').value,
      description: this.addTreatmentForm.get('description').value,
      estimatedDuration: this.addTreatmentForm.get('estimatedDuration').value,
      price: this.addTreatmentForm.get('price').value,
      pictureUrl: this.addTreatmentForm.get('pictureUrl').value,
    };
    console.log('treatment to add: ', treatmentData);
    this.treatmentService.addTreatment(treatmentData).subscribe(
      (treatment: Treatment) => {
        console.log('TreatmentAddComponent: added ', treatment);
        this.logService.add(
          `TreatmentAddComponent: added ${treatment.treatmentID}`
        );

        const selectedEmployeeId = Number(
          this.addTreatmentForm.get('employeeId').value
        );
        console.log('selected employee id: ', selectedEmployeeId);
        console.log('the employees: ', this.employees);
        const selectedEmployee = this.employees.find(
          (emp) => emp.personId === selectedEmployeeId
        );

        console.log('selected employee: ', selectedEmployee);

        if (selectedEmployee) {
          const employeeTreatmentData = {
            employeeID: selectedEmployee.personId,
            treatmentID: treatment.treatmentID,
          };
          console.log('Employee treatment data:', employeeTreatmentData);

          this.employeeTreatmentService
            .addEmployeeTreatment(employeeTreatmentData)
            .subscribe(
              () => {
                console.log('EmployeeTreatment added successfully.');
                this.logService.add(
                  `EmployeeTreatment added for treatmentID ${treatment.treatmentID}`
                );
              },
              (error) => {
                console.error('Error while adding employee treatment:', error);
                this.logService.add(
                  `Error adding EmployeeTreatment for treatmentID ${treatment.treatmentID}`
                );
              }
            );
        } else {
          console.error('Selected employee not found');
        }
      },
      (error) => {
        console.error('Error while adding treatment:', error);
      }
    );
  }

  onBack(): void {
    this.location.back();
  }
}
