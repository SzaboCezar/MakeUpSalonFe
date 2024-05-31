import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentDeleteComponent } from './treatment-delete.component';

describe('TreatmentDeleteComponent', () => {
  let component: TreatmentDeleteComponent;
  let fixture: ComponentFixture<TreatmentDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreatmentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
