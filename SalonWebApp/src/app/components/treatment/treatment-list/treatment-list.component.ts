import {Component, OnInit} from '@angular/core';
import {Treatment} from "../../../shared/models/Treatment.model";
import {TreatmentService} from "../../../services/treatment.service";
import {CommonModule, DatePipe} from "@angular/common";
import {
  NgbAccordionBody, NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader,
  NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";

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
    NgbAccordionHeader
  ],
  templateUrl: './treatment-list.component.html',
  styleUrl: './treatment-list.component.scss'
})
export class TreatmentListComponent implements OnInit {

  selectedTreatment?: Treatment;
  treatments: Treatment[];

  constructor(private treatmentService: TreatmentService) {

  }

  ngOnInit(): void {
   this.getTreatments();
  }

  getTreatments(): void {
    this.treatmentService.getTreatments().subscribe((treatments) => {
      this.treatments = treatments;
      console.log(this.treatments.length);
    });
  }

  onSelect(treatment: Treatment): void {
    this.selectedTreatment = treatment;
    this.treatmentService.getTreatment(treatment.treatmentID);
  }

}
