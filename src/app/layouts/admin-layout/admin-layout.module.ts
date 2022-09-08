import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from '@handsontable/angular';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { TripsComponent } from 'src/app/trips/trips.component';
import { CargoComponent } from 'src/app/cargo/cargo.component';
import { AboutComponent } from 'src/app/about/about.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HotTableModule
  ],
  declarations: [TripsComponent, CargoComponent, AboutComponent]
})
export class AdminLayoutModule {}
