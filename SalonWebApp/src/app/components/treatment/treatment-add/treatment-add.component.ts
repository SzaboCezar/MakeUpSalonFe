import { Component, OnInit } from '@angular/core';
import { Treatment } from "../../../shared/models/Treatment.model";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TreatmentService } from "../../../services/treatment.service";
import { LogsService } from "../../../logs/logs.service";
import { Location, NgForOf, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { EmployeeTreatment } from "../../../shared/models/EmployeeTreatment.model";
import { LoadingSpinnerComponent } from "../../dom-element/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-treatment-add',
  styleUrls: ['./treatment-add.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './treatment-add.component.html'
})
export class TreatmentAddComponent implements OnInit {
  isLoading = false;
  treatment?: Treatment = {
    treatmentID: null,
    name: null,
    description: null,
    estimatedDuration: null,
    price: null,
    pictureURL: null,
    employeeTreatments: null
  };

  addTreatmentForm: FormGroup;
  employeeTreatments?: EmployeeTreatment[];

  constructor(
    private route: ActivatedRoute,
    private treatmentService: TreatmentService,
    private logService: LogsService,
    private location: Location
  ) {}

  ngOnInit() {
    this.addTreatmentForm = new FormGroup({
      'treatmentID': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required]),
      'estimatedDuration': new FormControl(null, [Validators.required]),
      'price': new FormControl(null, [Validators.required]),
      'pictureURL': new FormControl(null, [Validators.required]),
      'employeeTreatments': new FormControl(null)
    });
  }

  onAdd(): void {
    if (this.addTreatmentForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.treatment = this.addTreatmentForm.getRawValue();

    this.treatmentService.addTreatment(this.treatment).subscribe(
      () => {
        console.log("TreatmentAddComponent: added ", this.treatment);
        this.logService.add(
          `TreatmentAddComponent: added ${this.treatment?.treatmentID}`
        );
        this.isLoading = false;
      },
      (error) => {
        console.error("Error while adding treatment:", error);
        this.logService.add(
          `TreatmentAddComponent: error adding ${this.treatment?.treatmentID}`
        );
        this.isLoading = false;
      }
    );
  }

  onBack(): void {
    this.location.back();
  }
}