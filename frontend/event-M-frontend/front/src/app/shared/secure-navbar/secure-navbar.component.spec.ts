import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureNavbarComponent } from './secure-navbar.component';

describe('SecureNavbarComponent', () => {
  let component: SecureNavbarComponent;
  let fixture: ComponentFixture<SecureNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecureNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
