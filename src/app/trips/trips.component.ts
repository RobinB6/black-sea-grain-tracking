import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { getTripData } from '../data-grid/utils/constants';

import {
	alignHeaders,
	drawCheckboxInRowHeaders,
	addClassesToRows,
	changeCheckboxCell,
} from '../data-grid/utils/hooks-callbacks';

@Component({
	encapsulation: ViewEncapsulation.None,
	templateUrl: './trips.component.html',
	styleUrls: ['./trips.component.scss'],
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
		'Notes',
	];

	ngOnInit(): void {
		this.getTrips();
	}

	getTrips(): void {
		getTripData().forEach((i) => {
			let cargo = i.cargo;
			let cargoSize = i.cargo_size;
			let notes = i.notes;
			if (Array.isArray(i.cargo)) {
				cargo = i.cargo.map((v) => v.cargo).join(', ');
				cargoSize = i.cargo
					.map((v) => v.cargo_size)
					.reduce((pSum, a) => pSum + a, 0);
				const cargoes = i.cargo
					.map((v) => `${v.cargo}: ${v.cargo_size}`)
					.join(', ');
				notes = notes ? `${notes}, ${cargoes}` : cargoes;
			}
			this.dataset.push([
				i.vname,
				i.port_origin,
				i.departure,
				cargo,
				cargoSize,
				i.destination,
				i.status,
				notes,
			]);
		});
	}
}
