
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Deal {
  id: string; source: string; externalId?: string; title: string; address: string; city: string; state: string;
  units?: number; sqft?: number; price: number; noi?: number; capRate?: number; createdAt?: string; updatedAt?: string;
}
export interface FinanceRequest { interestRate: number; ltv: number; termYears: number; }
export interface FinanceResult { id: string; dealId: string; interestRate: number; ltv: number; termYears: number; annualDebtSvc: number; dscr: number; cashFlowYr1: number; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.API_URL;
  constructor(private http: HttpClient) {}
  listDeals(params?: { city?: string; state?: string; minCap?: number; maxPrice?: number; minUnits?: number }): Observable<Deal[]> {
    let p = new HttpParams(); if (params) Object.entries(params).forEach(([k,v])=>{ if (v!==undefined && v!==null && v!=='') p=p.set(k,String(v)); });
    return this.http.get<Deal[]>(`${this.base}/deals`, { params: p });
  }
  createFinance(dealId: string, body: FinanceRequest): Observable<FinanceResult> {
    return this.http.post<FinanceResult>(`${this.base}/deals/${dealId}/finance`, body);
  }
  ingestBulk(city: string, state: string, items: Partial<Deal>[]) {
    return this.http.post(`${this.base}/ingest/bulk`, { city, state, items });
  }
}
