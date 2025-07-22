import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminService } from '../../../services/admin.service';
import { Question } from '../../../models/question.model';
import { AnswerQuestionDialogComponent } from '../answer-question-dialog/answer-question-dialog.component';

@Component({
  selector: 'app-admin-qa-management',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './admin-qa-management.component.html',
  styleUrls: ['./admin-qa-management.component.scss']
})
export class AdminQaManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  public unansweredQuestions: Question[] = [];
  public isLoading = true;

  ngOnInit(): void {
    this.loadUnansweredQuestions();
  }

  loadUnansweredQuestions(): void {
    this.isLoading = true;
    this.adminService.getUnansweredQuestions().subscribe({
      next: (questions) => {
        this.unansweredQuestions = questions;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.showNotification('Failed to load unanswered questions.', 'error');
      }
    });
  }

  openAnswerDialog(question: Question): void {
    const dialogRef = this.dialog.open(AnswerQuestionDialogComponent, {
      width: '600px',
      data: { question } // Pass the question object to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // If the dialog returned an answer...
      if (result && result.answerText) {
        this.adminService.answerQuestion(question.id, result.answerText).subscribe({
          next: () => {
            this.showNotification('Question answered successfully!', 'success');
            this.loadUnansweredQuestions(); // Refresh the list
          },
          error: () => this.showNotification('Failed to submit answer.', 'error')
        });
      }
    });
  }

  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000, panelClass: [panelClass] });
  }
}