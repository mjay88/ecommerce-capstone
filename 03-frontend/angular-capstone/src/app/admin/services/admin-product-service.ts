import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminProduct } from '../models/admin-product';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly baseUrl = `${environment.apiUrl}/admin/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(this.baseUrl);
  }

  getById(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.baseUrl}/${id}`);
  }

  create(payload: Partial<AdminProduct>): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<AdminProduct>): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(productId: number, file: File): Observable<AdminProduct> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<AdminProduct>(
      `${this.baseUrl}/${productId}/image`,
      formData
    );
  }
}
