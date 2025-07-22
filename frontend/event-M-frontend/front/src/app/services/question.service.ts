import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8080/api/questions';
  private http = inject(HttpClient);

  getAnsweredQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/answered`);
  }

  submitQuestion(questionText: string): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, { questionText });
  }
}