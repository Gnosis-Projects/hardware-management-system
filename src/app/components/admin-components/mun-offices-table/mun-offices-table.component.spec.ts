import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunOfficesTableComponent } from './mun-offices-table.component';

describe('MunOfficesTableComponent', () => {
  let component: MunOfficesTableComponent;
  let fixture: ComponentFixture<MunOfficesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunOfficesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MunOfficesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
