import { Component, OnDestroy, OnInit } from '@angular/core';
import { Treatment } from '../../../shared/models/Treatment.model';
import { TreatmentService } from '../../../services/treatment.service';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavBarComponent } from '../../dom-element/nav-bar/nav-bar.component';
import { LoadingSpinnerComponent } from '../../dom-element/loading-spinner/loading-spinner.component';
import { PersonService } from '../../../services/person.service';
import { Person } from '../../../shared/models/Person.model';

@Component({
  selector: 'app-treatment-list',
  standalone: true,
  imports: [
    DatePipe,
    NgbAccordionDirective,
    NgbAccordionItem,
    RouterLink,
    CommonModule,
    NgbAccordionBody,
    NgbAccordionCollapse,
    NgbAccordionButton,
    NgbAccordionHeader,
    NavBarComponent,
    NgbTooltip,
    LoadingSpinnerComponent,
  ],
  templateUrl: './treatment-list.component.html',
  styleUrl: './treatment-list.component.scss',
})
export class TreatmentListComponent implements OnInit, OnDestroy {
  treatmentSubscription: Subscription;
  selectedTreatment?: Treatment;
  treatments: Treatment[];
  selectedEmployeeTreatments: { [key: number]: Person[] } = {};

  constructor(
    private treatmentService: TreatmentService,
    private personService: PersonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.treatmentSubscription =
      this.treatmentService.treatmentsChanged.subscribe(
        (treatments: Treatment[]) => {
          this.treatments = treatments;
        }
      );

    this.treatments = this.treatmentService.getTreatments();
    console.log('treatments: ', this.treatments);
    this.initializeEmployeeTreatments();
  }

  initializeEmployeeTreatments(): void {
    console.log('treatments: ', this.treatments);
    const treatmentObservables = this.treatments.map((treatment) => {
      const employeeObservables = treatment.employeeIds.map((id) =>
        this.personService.getPersonById(id)
      );

      return forkJoin(employeeObservables).pipe(
        map((employees: Person[]) => ({
          treatmentID: treatment.treatmentID,
          employees: employees,
        }))
      );
    });

    forkJoin(treatmentObservables).subscribe(
      (results) => {
        results.forEach((result) => {
          this.selectedEmployeeTreatments[result.treatmentID] =
            result.employees;
        });
        console.log('treatments: ', this.treatments);
        console.log('selected employees: ', this.selectedEmployeeTreatments);
      },
      (error) => {
        console.error('Error initializing employee treatments', error);
      }
    );
  }

  onSelect(treatment: Treatment): void {
    this.selectedTreatment = treatment;
    this.treatmentService.getTreatment(treatment.treatmentID);
  }

  ngOnDestroy() {
    this.treatmentSubscription.unsubscribe();
  }
}
