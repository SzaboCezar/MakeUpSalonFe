import { Component, OnInit } from '@angular/core';
import { Treatment } from '../../../../shared/models/Treatment.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { TreatmentService } from '../../../../services/treatment.service';
import { LogsService } from '../../../../logs/logs.service';
import { Location, NgForOf, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeTreatment } from '../../../../shared/models/EmployeeTreatment.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../../../../shared/models/Person.model';
import { PersonService } from '../../../../services/person.service';
import { forkJoin } from 'rxjs';
import { User } from '../../../../shared/models/User.model';
import { UserService } from '../../../../services/user.service';
import { EmployeeTreatmentService } from '../../../../services/employee-treatment.service';

@Component({
  selector: 'app-treatment-detail-update',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, NgIf, NgbTooltip, RouterLink],
  templateUrl: './treatment-detail-update.component.html',
  styleUrl: './treatment-detail-update.component.css',
})
export class TreatmentDetailUpdateComponent implements OnInit {
  treatment?: Treatment;
  updateTreatmentForm?: FormGroup;
  employeeTreatments?: EmployeeTreatment[] = [];
  employees: Person[] = [];
  associatedEmployeeId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private treatmentService: TreatmentService,
    private location: Location,
    private logService: LogsService,
    private employeeTreatmentService: EmployeeTreatmentService,
    private userService: UserService,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTreatment();

    this.updateTreatmentForm = new FormGroup({
      treatmentID: new FormControl(this.treatment.treatmentID, [
        Validators.required,
      ]),
      name: new FormControl(this.treatment.name, [Validators.required]),
      description: new FormControl(this.treatment.description, [
        Validators.required,
      ]),
      estimatedDuration: new FormControl(this.treatment.estimatedDuration, [
        Validators.required,
      ]),
      price: new FormControl(this.treatment.price, [Validators.required]),
      pictureURL: new FormControl(this.treatment.pictureUrl, [
        Validators.required,
      ]),
      //TODO: make it required after we have the employeeTreatments
      employeeId: new FormControl(null),
    });

    // // Initialize the form with null values
    // this.updateTreatmentForm = new FormGroup({
    //   name: new FormControl(null, [Validators.required]),
    //   description: new FormControl(null, [Validators.required]),
    //   estimatedDuration: new FormControl(null, [Validators.required]),
    //   price: new FormControl(null, [Validators.required]),
    //   pictureURL: new FormControl(null, [Validators.required]),
    //   employeeId: new FormControl(null),
    // });

    // Fetch employees for the dropdown
    this.userService.getUsersByRole('EMPLOYEE').subscribe((users: User[]) => {
      const personObservables = users.map((user) =>
        this.personService.getPersonById(user.userId)
      );
      forkJoin(personObservables).subscribe((persons: Person[]) => {
        this.employees = persons;

        // After fetching employees, get the treatment details
        this.getTreatment();
      });
    });
  }

  getTreatment(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.treatmentService.getTreatment(id).subscribe((treatment) => {
        this.treatment = treatment;
        this.fetchEmployeeTreatments(treatment.treatmentID);
      });
    });
  }

  fetchEmployeeTreatments(treatmentId: number): void {
    this.employeeTreatmentService.fetchEmployeeTreatments().subscribe(
      (employeeTreatments) => {
        this.employeeTreatments = employeeTreatments.filter(
          (et) => et.treatmentID === treatmentId
        );
        console.log('EMPLOYEE TREATMENTS FETCH: ', this.employeeTreatments);
      },
      (error) => {
        console.error('Error fetching employee treatments:', error);
      }
    );
  }

  onUpdate(): void {
    if (this.updateTreatmentForm.invalid) {
      return;
    }

    const treatmentData = {
      treatmentID: this.treatment.treatmentID,
      name: this.updateTreatmentForm.get('name').value,
      description: this.updateTreatmentForm.get('description').value,
      estimatedDuration:
        this.updateTreatmentForm.get('estimatedDuration').value,
      price: this.updateTreatmentForm.get('price').value,
      pictureUrl: this.updateTreatmentForm.get('pictureURL').value,
    };

    console.log('treatment to add: ', treatmentData);

    this.treatmentService.updateTreatment(treatmentData).subscribe(
      (treatment: Treatment) => {
        console.log('TreatmentAddComponent: added ', treatment);
        this.logService.add(
          `TreatmentAddComponent: updated ${treatment.treatmentID}`
        );

        const selectedEmployeeId = Number(
          this.updateTreatmentForm.get('employeeId').value
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
            treatmentID: this.treatment.treatmentID,
          };
          console.log('Employee treatment data:', employeeTreatmentData);
          const employeeTreatment = this.employeeTreatments[0];
          console.log('employee Treatment id: ', employeeTreatment);
          this.employeeTreatmentService
            .updateEmployeeTreatment(
              employeeTreatment.employeeTreatmentsId,
              employeeTreatmentData
            )
            .subscribe(
              () => {
                console.log('EmployeeTreatment added successfully.');
                this.logService.add(
                  `EmployeeTreatment added for treatmentID ${treatment.treatmentID}`
                );
               this.router.navigate(['/treatments']);
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

    // this.treatment = this.updateTreatmentForm.getRawValue();

    // try {
    //   this.treatmentService.updateTreatment(this.treatment).subscribe(() => {
    //     this.logService.add(
    //       `TreatmentDetailUpdateComponent: updated ${this.treatment?.name}`
    //     );
    //     this.location.back();
    //   });
    // } catch (error) {
    //   this.logService.add(
    //     `TreatmentDetailUpdateComponent: error updating ${this.treatment?.name}`
    //   );
    // }
  }

  onBack(): void {
    this.location.back();
  }
}
