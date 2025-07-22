import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQaManagementComponent } from './admin-qa-management.component';

describe('AdminQaManagementComponent', () => {
  let component: AdminQaManagementComponent;
  let fixture: ComponentFixture<AdminQaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQaManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminQaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
