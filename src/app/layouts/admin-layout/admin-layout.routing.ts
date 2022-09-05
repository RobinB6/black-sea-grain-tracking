import { Routes } from '@angular/router';

import { TripsComponent } from '../../trips/trips.component';
import { CargoComponent } from '../../cargo/cargo.component';

export const AdminLayoutRoutes: Routes = [
	{ path: 'trips', component: TripsComponent },
	{ path: 'cargo', component: CargoComponent },
];
