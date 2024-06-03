import {Component, OnDestroy, OnInit} from '@angular/core';
import {Treatment} from "../../../shared/models/Treatment.model";
import {TreatmentService} from "../../../services/treatment.service";
import {CommonModule, DatePipe} from "@angular/common";
import {
  NgbAccordionBody, NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader,
  NgbAccordionItem, NgbTooltip
} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {NavBarComponent} from "../../dom-element/nav-bar/nav-bar.component";
import {LoadingSpinnerComponent} from "../../dom-element/loading-spinner/loading-spinner.component";

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
    LoadingSpinnerComponent
  ],
  templateUrl: './treatment-list.component.html',
  styleUrl: './treatment-list.component.scss'
})
export class TreatmentListComponent implements OnInit, OnDestroy {


  treatmentSubscription: Subscription;
  selectedTreatment?: Treatment;
  treatments: Treatment[];


  constructor(
    private treatmentService: TreatmentService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // this.getTreatments();
    this.treatmentSubscription = this.treatmentService.treatmentsChanged
      .subscribe(
        (treatments: Treatment[]) => {
          this.treatments = treatments;
        }
      );

    this.treatments = this.treatmentService.getTreatments();
  }

  // getTreatments(): void {
  //   this.treatmentService.getTreatments().subscribe((treatments) => {
  //     this.treatments = treatments;
  //     console.log(this.treatments.length);
  //   });
  // }

  onSelect(treatment: Treatment): void {
    this.selectedTreatment = treatment;
    this.treatmentService.getTreatment(treatment.treatmentID);
  }

  ngOnDestroy() {
    this.treatmentSubscription.unsubscribe();
  }
}
