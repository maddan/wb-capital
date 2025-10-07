
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Papa from 'papaparse';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-ingest-bulk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingest-bulk.component.html'
})
export class IngestBulkComponent {
  city = 'Austin'; state = 'TX'; uploading = false; lastResult: any;
  constructor(private api: ApiService) {}
  onFile(e: Event) {
    const input = e.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
    this.uploading = true;
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: results => {
        const rows = (results.data as any[]).filter(r => r.title && r.price);
        const items = rows.map(r => ({
          source: r.source || 'bulk',
          externalId: r.externalId || undefined,
          title: r.title, address: r.address,
          price: Number(String(r.price).replace(/[$,]/g,'')) || 0,
          noi: r.noi ? Number(String(r.noi).replace(/[$,]/g,'')) : undefined,
          capRate: r.capRate ? Number(String(r.capRate).replace(/[^0-9.]/g,'')) : undefined,
          units: r.units ? parseInt(r.units, 10) : undefined,
          sqft: r.sqft ? parseInt(r.sqft, 10) : undefined,
        }));
        this.api.ingestBulk(this.city, this.state, items).subscribe({
          next: res => { this.lastResult = res; this.uploading = false; },
          error: err => { alert(err?.error?.message || err.message); this.uploading = false; }
        });
      },
      error: err => { alert('CSV parse error: ' + err.message); this.uploading = false; }
    });
  }
}
