import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerQuestionDialogComponent } from './answer-question-dialog.component';

describe('AnswerQuestionDialogComponent', () => {
  let component: AnswerQuestionDialogComponent;
  let fixture: ComponentFixture<AnswerQuestionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerQuestionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswerQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
