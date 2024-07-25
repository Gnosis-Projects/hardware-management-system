import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDataButtonComponent } from './export-data-button.component';

describe('ExportDataButtonComponent', () => {
  let component: ExportDataButtonComponent;
  let fixture: ComponentFixture<ExportDataButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportDataButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportDataButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
