import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailParticipantsComponent } from './email-participants.component';

describe('EmailParticipantsComponent', () => {
  let component: EmailParticipantsComponent;
  let fixture: ComponentFixture<EmailParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailParticipantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
