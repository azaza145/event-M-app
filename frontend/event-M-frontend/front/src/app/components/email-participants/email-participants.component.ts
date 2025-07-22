import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-email-participants',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './email-participants.component.html',
})
export class EmailParticipantsComponent {
  emailForm = this.fb.group({
    subject: ['', Validators.required],
    body: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailParticipantsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventTitle: string }
  ) {
    // Pre-fill the subject line for convenience
    this.emailForm.get('subject')?.setValue(`Mise à jour concernant: ${data.eventTitle}`);
  }

  onSend(): void {
    if (this.emailForm.valid) {
      this.dialogRef.close(this.emailForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}