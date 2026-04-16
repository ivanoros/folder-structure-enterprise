import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailPageComponent } from './customer-detail-page.component';

describe('CustomerDetailPageComponent', () => {
  let component: CustomerDetailPageComponent;
  let fixture: ComponentFixture<CustomerDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
