import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationItemDetailsComponent } from './workstation-item-details.component';

describe('WorkstationItemDetailsComponent', () => {
  let component: WorkstationItemDetailsComponent;
  let fixture: ComponentFixture<WorkstationItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationItemDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkstationItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
