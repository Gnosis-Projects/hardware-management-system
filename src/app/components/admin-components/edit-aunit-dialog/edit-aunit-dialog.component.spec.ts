import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAunitDialogComponent } from './edit-aunit-dialog.component';

describe('EditAunitDialogComponent', () => {
  let component: EditAunitDialogComponent;
  let fixture: ComponentFixture<EditAunitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAunitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAunitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
