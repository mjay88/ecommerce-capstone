import { Component, OnInit } from '@angular/core';
import { AdminReports } from '../../services/admin-reports';

interface PurchaseReportItem {
  productName: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface PurchaseReportOrder {
  orderTrackingNumber: string;
  dateCreated: string;        // ISO string from backend
  customerEmail: string;
  totalQuantity: number;
  totalPrice: number;
  items: PurchaseReportItem[];
}

@Component({
  selector: 'app-purchases-report',
  standalone: false,
  templateUrl: './purchases-report.html',
  styleUrl: './purchases-report.css',
})
export class PurchasesReport implements OnInit {

  orders: PurchaseReportOrder[] = [];
  loading = false;
  errorMsg = '';

  // track expanded rows by tracking number
  private expanded = new Set<string>();
  
  constructor(private reports: AdminReports) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';

    this.reports.getPurchases().subscribe({
      next: (data: PurchaseReportOrder[]) => {
        this.orders = (data ?? []).slice();

        // newest first (defensive)
        this.orders.sort((a, b) => {
          const ta = a?.dateCreated ? Date.parse(a.dateCreated) : 0;
          const tb = b?.dateCreated ? Date.parse(b.dateCreated) : 0;
          return tb - ta;
        });

        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message ??
          err?.message ??
          'Failed to load purchases report.';
      },
    });
  }

  toggle(orderTrackingNumber: string): void {
    if (!orderTrackingNumber) return;

    if (this.expanded.has(orderTrackingNumber)) {
      this.expanded.delete(orderTrackingNumber);
    } else {
      this.expanded.add(orderTrackingNumber);
    }
  }

  isOpen(orderTrackingNumber: string): boolean {
    return !!orderTrackingNumber && this.expanded.has(orderTrackingNumber);
  }
}
