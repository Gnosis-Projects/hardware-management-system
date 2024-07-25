import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComputersFormComponent } from './search-form.component';

describe('SearchComputersFormComponent', () => {
  let component: SearchComputersFormComponent;
  let fixture: ComponentFixture<SearchComputersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComputersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchComputersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
