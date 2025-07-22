import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Event } from '../../../models/event.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent {
  public eventForm: FormGroup; // No "!" needed as it's initialized in the constructor
  public allUsers: User[] = [];
  public isEditMode = false;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventFormComponent>,
    // The data passed to the dialog now includes the user list
    @Inject(MAT_DIALOG_DATA) public data: { event: Event | null, allUsers: User[] }
  ) {
    // --- THIS IS THE FIX ---
    // Initialize the form in the constructor to ensure it exists before the template renders.
    
    this.allUsers = data.allUsers; // Get the user list from the injected data
    const eventData = this.data?.event;
    this.isEditMode = !!eventData;
    
    const participantIds = eventData?.participants?.map(p => p.id) || [];

    this.eventForm = this.fb.group({
      title: [eventData?.title || '', Validators.required],
      description: [eventData?.description || ''],
      date: [eventData?.date ? new Date(eventData.date) : '', Validators.required],
      location: [eventData?.location || '', Validators.required],
      participantIds: [participantIds]
    });
  }

  onSave(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}