import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReport } from './inventory-report';

describe('InventoryReport', () => {
  let component: InventoryReport;
  let fixture: ComponentFixture<InventoryReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
