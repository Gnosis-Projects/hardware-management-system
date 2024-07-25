import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationDetailComponent } from './workstation-detail.component';

describe('WorkstationDetailComponent', () => {
  let component: WorkstationDetailComponent;
  let fixture: ComponentFixture<WorkstationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkstationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
