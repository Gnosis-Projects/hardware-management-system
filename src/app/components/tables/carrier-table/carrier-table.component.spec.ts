import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierTableComponent } from './carrier-table.component';

describe('CarrierTableComponent', () => {
  let component: CarrierTableComponent;
  let fixture: ComponentFixture<CarrierTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrierTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
