import { Routes } from '@angular/router';

import { TripsComponent } from 'src/app/trips/trips.component';
import { CargoComponent } from 'src/app/cargo/cargo.component';
import { DestinationsComponent } from 'src/app/destinations/destinations.component';
import { AboutComponent } from 'src/app/about/about.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

export const AdminLayoutRoutes: Routes = [
	{ path: '', component: DashboardComponent },
	{ path: 'trips', component: TripsComponent },
	{ path: 'cargo', component: CargoComponent },
	{ path: 'destinations', component: DestinationsComponent },
	{ path: 'about', component: AboutComponent },
];
