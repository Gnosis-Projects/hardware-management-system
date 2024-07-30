import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarrierDialogComponent } from './add-carrier-dialog.component';

describe('AddCarrierDialogComponent', () => {
  let component: AddCarrierDialogComponent;
  let fixture: ComponentFixture<AddCarrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCarrierDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
