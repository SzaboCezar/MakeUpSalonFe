import {Component, OnInit} from '@angular/core';
import {Treatment} from "../../../shared/models/Treatment.model";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TreatmentService} from "../../../services/treatment.service";
import {LogsService} from "../../../logs/logs.service";
import {Location, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EmployeeTreatment} from "../../../shared/models/EmployeeTreatment.model";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {LoadingSpinnerComponent} from "../../dom-element/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-treatment-add',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgbTooltip,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './treatment-add.component.html',
  styleUrl: './treatment-add.component.css'
})
export class TreatmentAddComponent {
  treatment?: Treatment = {
    treatmentID: null,
    name: null,
    description: null,
    estimatedDuration: null,
    price: null,
    pictureURL: null,
    employeeTreatments: null
  };

  employeeTreatments?: EmployeeTreatment[];

  constructor(
    private route: ActivatedRoute,
    private treatmentService: TreatmentService,
    private logService: LogsService,
    private location: Location
  ) {}

  onAdd(): void {
    try {
      this.treatmentService.addTreatment(this.treatment).subscribe(() => {
        this.logService.add(
          `TreatmentAddComponent: added ${this.treatment?.treatmentID}`
        );
      });
    } catch (error) {
      this.logService.add(
        `TreatmentAddComponent: error adding ${this.treatment?.treatmentID}`
      );
    }
  }

  onBack(): void {
    this.location.back();
  }
}
