import { Component, OnInit } from '@angular/core';
import { AdminReports, InventoryRow } from '../../services/admin-reports';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.html',
  styleUrls: ['./inventory-report.css'],
  standalone: false
})
export class InventoryReport implements OnInit {
  loading = false;
  errorMsg: string | null = null;

  rows: InventoryRow[] = [];
  
  constructor(private reports: AdminReports) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = null;

    this.reports.getInventory().subscribe({
      next: (rows) => {
        this.rows = rows ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Inventory report error:', err);
        this.errorMsg =
          err?.error?.message ??
          err?.message ??
          'Failed to load inventory report.';
        this.loading = false;
      }
    });
  }

  trackById(_: number, row: InventoryRow) {
    return row.id ?? row.sku ?? row.name ?? _;
  }
}
