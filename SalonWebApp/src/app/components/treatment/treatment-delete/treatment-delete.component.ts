import {Component, OnInit} from '@angular/core';
import {Treatment} from "../../../shared/models/Treatment.model";
import {ActivatedRoute} from "@angular/router";
import {TreatmentService} from "../../../services/treatment.service";
import {LogsService} from "../../../logs/logs.service";
import {Location, NgIf} from '@angular/common';


@Component({
  selector: 'app-treatment-delete',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './treatment-delete.component.html',
  styleUrl: './treatment-delete.component.scss'
})
export class TreatmentDeleteComponent implements OnInit {
  treatment?: Treatment;

  constructor(
    private route: ActivatedRoute,
    private treatmentService: TreatmentService,
    private location: Location,
    private logService: LogsService
  ) {}

  ngOnInit(): void {
    this.getTreatment();
  }

  getTreatment(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.treatmentService.getTreatment(id).subscribe((treatment) =>
        this.treatment = treatment);
    });
  }

  onConfirm(): void {
    if (this.treatment) {
      this.treatmentService.deleteTreatment(this.treatment.treatmentID).subscribe(() => {
        this.logService.add('TreatmentDeleteComponent: deleted treatment with id ' + this.treatment?.treatmentID)
        this.location.back();
      });
    }
  }

  onCancel(): void {
    this.location.back();
  }

}
