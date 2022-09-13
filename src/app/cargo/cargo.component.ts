import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { getTripData } from '../data-grid/utils/constants';

import {
	alignHeaders,
	drawCheckboxInRowHeaders,
	addClassesToRows,
	changeCheckboxCell,
} from '../data-grid/utils/hooks-callbacks';

interface Cargo {
	name: string;
	trips: number;
	on_ship: number;
	delivered: number;
	total: number;
}

@Component({
	encapsulation: ViewEncapsulation.None,
	templateUrl: './cargo.component.html',
	styleUrls: ['./cargo.component.scss'],
})
export class CargoComponent implements OnInit {
	dataset: Cargo[] = [];
	alignHeaders = alignHeaders;
	drawCheckboxInRowHeaders = drawCheckboxInRowHeaders;
	addClassesToRows = addClassesToRows;
	changeCheckboxCell = changeCheckboxCell;
	colHeaders = [
		'Commodity',
		'Number of Shipments',
		'Enroute (mt)',
		'Delivered (mt)',
		'Total (Enroute + Delivered)',
	];

	ngOnInit(): void {
		this.getCargo();
	}

	getCargo(): void {
		let sums: Cargo[] = [];
		let allTotal = <Cargo>{
			name: 'Total',
			trips: 0,
			on_ship: 0,
			delivered: 0,
			total: 0,
		};
		getTripData().forEach((i) => {
			if (Array.isArray(i.cargo)) {
				// If multiple types of cargo in one ship
				i.cargo.forEach((j) => {
					[sums, allTotal] = this.addCargo(j, sums, allTotal);
				});
			} else {
				// If single type of cargo in one ship
				[sums, allTotal] = this.addCargo(i, sums, allTotal);
			}
		});
		this.dataset.push(...sums, allTotal);
	}

	addCargo(trip, sums, allTotal) {
		if (sums.find((c) => c.name === trip.cargo) == null) {
			sums.push({
				name: trip.cargo,
				trips: 0,
				on_ship: 0,
				delivered: 0,
				total: 0,
			});
		}
		const c = sums.find((c) => c.name === trip.cargo);
		trip.status === 'Shipped'
			? (c.on_ship += trip.cargo_size)
			: (c.delivered += trip.cargo_size);
		c.total += trip.cargo_size;
		c.trips += 1;

		trip.status === 'Shipped'
			? (allTotal.on_ship += trip.cargo_size)
			: (allTotal.delivered += trip.cargo_size);
		allTotal.total += trip.cargo_size;
		allTotal.trips += 1;
		return [sums, allTotal];
	}
}
