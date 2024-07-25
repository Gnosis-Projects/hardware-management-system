import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkstationFormComponent } from './add-workstation-dialog.component';

describe('AddWorkstationFormComponent', () => {
  let component: AddWorkstationFormComponent;
  let fixture: ComponentFixture<AddWorkstationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkstationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkstationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
