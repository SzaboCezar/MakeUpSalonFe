import { Component, OnInit } from '@angular/core';
import { Treatment } from '../../../../shared/models/Treatment.model';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-treatment-detail-update',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, NgIf, NgbTooltip],
  templateUrl: './treatment-detail-update.component.html',
  styleUrl: './treatment-detail-update.component.css',
})
export class TreatmentDetailUpdateComponent implements OnInit {
  treatment?: Treatment;
  updateTreatmentForm: FormGroup;
  employeeTreatments?: EmployeeTreatment[];

  constructor(
    private route: ActivatedRoute,
    private treatmentService: TreatmentService,
    private location: Location,
    private logService: LogsService
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
      pictureURL: new FormControl(this.treatment.pictureURL, [
        Validators.required,
      ]),
      //TODO: make it required after we have the employeeTreatments
      employeeTreatments: new FormControl(null),
    });
  }

  getTreatment(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.treatmentService
        .getTreatment(id)
        .subscribe((treatment) => (this.treatment = treatment));
    });
  }

  onUpdate(): void {
    if (this.updateTreatmentForm.invalid) {
      return;
    }

    this.treatment = this.updateTreatmentForm.getRawValue();

    try {
      this.treatmentService.updateTreatment(this.treatment).subscribe(() => {
        this.logService.add(
          `TreatmentDetailUpdateComponent: updated ${this.treatment?.name}`
        );
        this.location.back();
      });
    } catch (error) {
      this.logService.add(
        `TreatmentDetailUpdateComponent: error updating ${this.treatment?.name}`
      );
    }
  }

  onBack(): void {
    this.location.back();
  }
}
