import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Question } from '../../../models/question.model';

@Component({
  selector: 'app-answer-question-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './answer-question-dialog.component.html'
})
export class AnswerQuestionDialogComponent {
  answerForm = this.fb.group({
    answerText: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnswerQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { question: Question }
  ) {}

  onSave(): void {
    if (this.answerForm.valid) {
      this.dialogRef.close(this.answerForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}