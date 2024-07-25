import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHistoryComponent } from './item-history.component';

describe('ItemHistoryComponent', () => {
  let component: ItemHistoryComponent;
  let fixture: ComponentFixture<ItemHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
