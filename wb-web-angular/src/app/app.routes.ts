
import { Routes } from '@angular/router';
import { DealsListComponent } from './deals-list/deals-list.component';
import { IngestBulkComponent } from './ingest-bulk/ingest-bulk.component';
export const routes: Routes = [
  { path: '', redirectTo: 'deals', pathMatch: 'full' },
  { path: 'deals', component: DealsListComponent },
  { path: 'ingest', component: IngestBulkComponent },
];
