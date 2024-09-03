import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownOptionDialogComponent } from './dropdown-option-dialog.component';

describe('DropdownOptionDialogComponent', () => {
  let component: DropdownOptionDialogComponent;
  let fixture: ComponentFixture<DropdownOptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownOptionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
