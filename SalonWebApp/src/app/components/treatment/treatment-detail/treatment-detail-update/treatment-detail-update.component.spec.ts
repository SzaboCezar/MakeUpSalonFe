import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentDetailUpdateComponent } from './treatment-detail-update.component';

describe('TreatmentDetailUpdateComponent', () => {
  let component: TreatmentDetailUpdateComponent;
  let fixture: ComponentFixture<TreatmentDetailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentDetailUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreatmentDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
