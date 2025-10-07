import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Deal, FinanceRequest } from '../services/api.service';

type DealRow = Deal & { estDSCR?: number };

@Component({
  selector: 'app-deals-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deals-list.component.html'
})
export class DealsListComponent implements OnInit {
  // raw results from API
  allDeals: DealRow[] = [];
  // displayed rows after filters
  deals: DealRow[] = [];
  loading = false;

  // filters
  cityFilter = '';
  stateFilter = '';

  // finance assumptions for filtering + navigation
  finance: FinanceRequest = { interestRate: 7, ltv: 75, termYears: 30 };
  dscrMin = 1.25;              // threshold to keep a deal when applying finance filter
  applyFinanceFilter = false;  // toggle

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.load(); // initial load
  }

  load() {
    this.loading = true;
    this.api.listDeals({
      city: this.cityFilter || undefined,
      state: this.stateFilter || undefined
    }).subscribe({
      next: d => {
        this.allDeals = d;
        this.loading = false;
        this.applyFilters();
      },
      error: _ => { this.loading = false; }
    });
  }

  applyFilters() {
    // start with either server-filtered list or full list
    let rows = [...this.allDeals];

    // client-side fallback for city/state (in case API ignores params)
    if (this.cityFilter) {
      const c = this.cityFilter.toLowerCase();
      rows = rows.filter(r => (r.city || '').toLowerCase().includes(c));
    }
    if (this.stateFilter) {
      const s = this.stateFilter.toLowerCase();
      rows = rows.filter(r => (r.state || '').toLowerCase().includes(s));
    }

    // optional finance-based filter (compute DSCR with current inputs)
    if (this.applyFinanceFilter) {
      rows = rows.filter((r: DealRow) => {
        const noi = r.noi ?? 0;
        if (!noi || !r.price) return false;
        const dscr = this.estimateDSCR(r.price, noi, this.finance);
        r.estDSCR = dscr;              // ✅ store on a real field
        return dscr >= this.dscrMin;
      });
    } else {
      rows.forEach((r: DealRow) => delete r.estDSCR);  // ✅ clean up
    }

    this.deals = rows;
  }

  private estimateDSCR(price: number, noi: number, f: FinanceRequest) {
    const loan = price * (f.ltv / 100);
    const r = (f.interestRate / 100) / 12;           // monthly rate
    const n = f.termYears * 12;                      // months
    const pmt = loan === 0 || r === 0
      ? loan / n
      : loan * r / (1 - Math.pow(1 + r, -n));       // mortgage formula
    const annualDebtSvc = pmt * 12;
    const dscr = annualDebtSvc > 0 ? (noi / annualDebtSvc) : 0;
    return dscr;
  }

  // Send the user to details page with assumptions; that page will compute and show results
  goToCalc(deal: Deal) {
    this.router.navigate(['/deal', deal.id], {
      queryParams: {
        ir: this.finance.interestRate,
        ltv: this.finance.ltv,
        term: this.finance.termYears,
        autorun: 1
      }
    });
  }
}
