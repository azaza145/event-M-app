import { Component, Inject, OnInit, Optional } from '@angular/core'; // Import Optional
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean;
  allRoles = Object.values(UserRole).filter(role => role !== UserRole.ADMIN);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    // --- THIS IS THE FIX ---
    // Use @Optional() to tell Angular that this injected data might not exist.
    // This is good practice for dialogs that have dual create/edit modes.
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { user: User | null }
  ) {
    // Determine if we are editing based on if data and data.user were provided
    this.isEditMode = !!data?.user;
    
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], 
      role: [UserRole.USER, Validators.required]
    });
  }

  ngOnInit(): void {
    // Check for edit mode and apply values if necessary
    if (this.isEditMode && this.data.user) {
      this.userForm.patchValue(this.data.user);
      this.userForm.get('email')?.disable(); // Don't allow email to be changed in edit mode
      // Password is not needed/shown when editing
      this.userForm.get('password')?.clearValidators();
    } else {
      // Password is required only when creating a new user
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
    this.userForm.updateValueAndValidity();
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}