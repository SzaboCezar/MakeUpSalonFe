// import {Component, OnInit} from '@angular/core';
// import {Treatment} from "../../../shared/models/Treatment.model";
// import {ActivatedRoute} from "@angular/router";
// import {TreatmentService} from "../../../services/treatment.service";
// import {EmployeeTreatment} from "../../../shared/models/EmployeeTreatment.model";
//
// @Component({
//   selector: 'app-treatment-add',
//   standalone: true,
//   imports: [],
//   templateUrl: './treatment-add.component.html',
//   styleUrl: './treatment-add.component.scss'
// })
// export class TreatmentAddComponent implements OnInit {
//   treatment?: Treatment = {
//     treatmentID: number;
//     name: string;
//     description: string;
//     estimatedDuration: number;
//     price: number;
//     pictureURL: string;
//     employeeTreatments: EmployeeTreatment[];
//   };
//
//   plantsID?: number[];
//
//   constructor(
//     private route: ActivatedRoute,
//     private treatmentService: TreatmentService,
//     private location: Location
//   ) {}
//
//   ngOnInit(): void {
//     this.getAllPlantsID();
//   }
//
//   getAllPlantsID(): void{
//     this.plantsID = this.treatmentService.getAllPlantsID();
//   }
//
//   onAdd(): void {
//     try {
//       this.treatmentService.addTreatment(this.treatment).subscribe(() => {
//         this.messageService.add(
//           `TreatmentAddComponent: added ${this.treatment?.id}`
//         );
//       });
//     } catch (error) {
//       this.messageService.add(
//         `TreatmentAddComponent: error adding ${this.treatment?.id}`
//       );
//     }
//   }
//
//   onBack(): void {
//     this.location.back();
//   }
// }
