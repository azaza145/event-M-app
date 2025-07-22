import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResetRequestsComponent } from './admin-reset-requests.component';

describe('AdminResetRequestsComponent', () => {
  let component: AdminResetRequestsComponent;
  let fixture: ComponentFixture<AdminResetRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResetRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminResetRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
