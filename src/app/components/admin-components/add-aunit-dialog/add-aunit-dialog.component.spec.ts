import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAunitDialogComponent } from './add-aunit-dialog.component';

describe('AddAunitDialogComponent', () => {
  let component: AddAunitDialogComponent;
  let fixture: ComponentFixture<AddAunitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAunitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAunitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
