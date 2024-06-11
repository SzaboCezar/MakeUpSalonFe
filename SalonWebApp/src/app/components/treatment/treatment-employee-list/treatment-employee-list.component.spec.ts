import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentEmployeeListComponent } from './treatment-employee-list.component';

describe('TreatmentEmployeeListComponent', () => {
  let component: TreatmentEmployeeListComponent;
  let fixture: ComponentFixture<TreatmentEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentEmployeeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
