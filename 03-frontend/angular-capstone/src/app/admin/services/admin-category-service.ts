import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminCategory } from '../models/admin-category';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {
  // environment.apiUrl already includes "/api"
  private readonly baseUrl = `${environment.apiUrl}/admin/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(this.baseUrl);
  }

  create(payload: Partial<AdminCategory>): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<AdminCategory>): Observable<AdminCategory> {
    return this.http.put<AdminCategory>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
