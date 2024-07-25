import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AunitTableComponent } from './aunit-table.component';

describe('AunitTableComponent', () => {
  let component: AunitTableComponent;
  let fixture: ComponentFixture<AunitTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AunitTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AunitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
