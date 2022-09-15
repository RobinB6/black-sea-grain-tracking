import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { getTripData } from '../data-grid/utils/constants';

import {
	alignHeaders,
	drawCheckboxInRowHeaders,
	addClassesToRows,
	changeCheckboxCell,
} from '../data-grid/utils/hooks-callbacks';

interface Destination {
	country: string;
	trips: number;
	on_ship: number;
	delivered: number;
	total: number;
}

@Component({
	encapsulation: ViewEncapsulation.None,
	templateUrl: './destinations.component.html',
	styleUrls: ['./destinations.component.scss'],
})
export class DestinationsComponent implements OnInit {
	dataset: Destination[] = [];
	alignHeaders = alignHeaders;
	drawCheckboxInRowHeaders = drawCheckboxInRowHeaders;
	addClassesToRows = addClassesToRows;
	changeCheckboxCell = changeCheckboxCell;
	colHeaders = [
		'Country',
		'Number of Shipments',
		'Enroute (mt)',
		'Delivered (mt)',
		'Total (Enroute + Delivered)',
	];

	ngOnInit(): void {
		this.getDestination();
	}

	getDestination(): void {
		let sums: Destination[] = [];
		let allTotal = <Destination>{
			country: 'Total',
			trips: 0,
			on_ship: 0,
			delivered: 0,
			total: 0,
		};
		getTripData().forEach((i) => {
			if (Array.isArray(i.cargo)) {
				// If multiple types of cargo in one ship
				i.cargo.forEach((j) => {
					[sums, allTotal] = this.addCargo(i, j, sums, allTotal);
				});
			} else {
				// If single type of cargo in one ship
				[sums, allTotal] = this.addCargo(i, i, sums, allTotal);
			}
		});
		this.dataset.push(...sums, allTotal);
	}

	addCargo(trip, cargo, sums, allTotal) {
		console.log('addCargo', trip, sums, allTotal);
		const country = trip.destination.includes(',')
			? trip.destination.split(', ')[1]
			: trip.destination;
		if (sums.find((c) => c.country === country) == null) {
			sums.push({
				country: country,
				trips: 0,
				on_ship: 0,
				delivered: 0,
				total: 0,
			});
		}
		const c = sums.find((c) => c.country === country);
		console.log('found c', c);
		trip.status === 'Shipped'
			? (c.on_ship += cargo.cargo_size)
			: (c.delivered += cargo.cargo_size);
		c.total += cargo.cargo_size;
		c.trips += 1;

		trip.status === 'Shipped'
			? (allTotal.on_ship += cargo.cargo_size)
			: (allTotal.delivered += cargo.cargo_size);
		allTotal.total += cargo.cargo_size;
		allTotal.trips += 1;
		return [sums, allTotal];
	}
}
