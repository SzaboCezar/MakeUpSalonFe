import {Component, OnInit} from '@angular/core';
import {Treatment} from "../../../shared/models/Treatment.model";
import {ActivatedRoute} from "@angular/router";
import {TreatmentService} from "../../../services/treatment.service";
import {LogsService} from "../../../logs/logs.service";
import {Location} from '@angular/common';

@Component({
  selector: 'app-treatment-add',
  standalone: true,
  imports: [],
  templateUrl: './treatment-add.component.html',
  styleUrl: './treatment-add.component.scss'
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

  plantsID?: number[];

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
