import { Routes } from '@angular/router';

import { TripsComponent } from 'src/app/trips/trips.component';
import { CargoComponent } from 'src/app/cargo/cargo.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

export const AdminLayoutRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'cargo', component: CargoComponent }
];
