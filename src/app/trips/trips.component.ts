import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { getTripData } from '../data-grid/utils/constants';

import {
  alignHeaders,
  drawCheckboxInRowHeaders,
  addClassesToRows,
  changeCheckboxCell
} from '../data-grid/utils/hooks-callbacks';

@Component({
  encapsulation: ViewEncapsulation.None,
  templateUrl: './trips.component.html'
})
export class TripsComponent implements OnInit {
  dataset = [];
  alignHeaders = alignHeaders;
  drawCheckboxInRowHeaders = drawCheckboxInRowHeaders;
  addClassesToRows = addClassesToRows;
  changeCheckboxCell = changeCheckboxCell;
  colHeaders = [
    'Vessel Name',
    'Port of Origin',
    'Departure Date',
    'Cargo',
    'Cargo Size',
    'Destination',
    'Status',
    'Notes'
  ];

  ngOnInit (): void {
    this.getTrips();
  }

  getTrips (): void {
    getTripData().forEach((i) => {
      this.dataset.push([
        i.vname,
        i.port_origin,
        i.departure,
        i.cargo,
        i.cargo_size,
        i.destination,
        i.status,
        i.notes
      ]);
    });
  }
}
