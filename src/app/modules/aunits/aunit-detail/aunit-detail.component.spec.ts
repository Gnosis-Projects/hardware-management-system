import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AunitDetailComponent } from './aunit-detail.component';

describe('AunitDetailComponent', () => {
  let component: AunitDetailComponent;
  let fixture: ComponentFixture<AunitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AunitDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AunitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
