import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';

export interface InventoryRow {
  id?: number;
  sku?: string;
  name?: string;
  categoryName?: string;
  unitPrice?: number;
  unitsInStock?: number;
  active?: boolean;
  imageUrl?: string;
}

export interface PurchaseReportItem {
  productName: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseReportOrder {
  orderTrackingNumber: string;
  dateCreated: string;     // ISO string from backend
  customerEmail: string;
  totalQuantity: number;
  totalPrice: number;
  items: PurchaseReportItem[];
}

@Injectable({ providedIn: 'root' })
export class AdminReports {
  // If environment.apiUrl is something like "https://localhost:8443/api"
  // then baseUrl should be that. If it's only "https://localhost:8443",
  // then append "/api" here.
  private baseUrl = environment.apiUrl ?? 'https://localhost:8443/api';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryRow[]> {
    const url = `${this.baseUrl}/admin/reports/inventory`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        if (Array.isArray(res)) return res as InventoryRow[];
        if (Array.isArray(res?.items)) return res.items as InventoryRow[];
        if (Array.isArray(res?.content)) return res.content as InventoryRow[];
        return [];
      })
    );
  }

  getPurchases(): Observable<PurchaseReportOrder[]> {
    const url = `${this.baseUrl}/admin/reports/purchases`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        if (Array.isArray(res)) return res as PurchaseReportOrder[];
        if (Array.isArray(res?.items)) return res.items as PurchaseReportOrder[];
        if (Array.isArray(res?.content)) return res.content as PurchaseReportOrder[];
        return [];
      })
    );
  }
}
