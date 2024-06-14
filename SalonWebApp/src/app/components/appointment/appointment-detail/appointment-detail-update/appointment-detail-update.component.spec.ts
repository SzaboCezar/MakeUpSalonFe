import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailUpdateComponent } from './appointment-detail-update.component';

describe('AppointmentDetailUpdateComponent', () => {
  let component: AppointmentDetailUpdateComponent;
  let fixture: ComponentFixture<AppointmentDetailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetailUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
