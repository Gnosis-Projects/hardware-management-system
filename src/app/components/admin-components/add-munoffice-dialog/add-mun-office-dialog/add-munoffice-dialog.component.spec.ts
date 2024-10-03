import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMunOfficeDialogComponent } from './add-munoffice-dialog.component';

describe('AddMunOfficeDialogComponent', () => {
  let component: AddMunOfficeDialogComponent;
  let fixture: ComponentFixture<AddMunOfficeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMunOfficeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMunOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
