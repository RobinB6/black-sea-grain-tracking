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
		'On ships (mt)',
		'Delivered (mt)',
		'Total (On ships + Delivered)',
	];

	ngOnInit(): void {
		this.getCargo();
	}

	getCargo(): void {
		const sums: Cargo[] = [];
		const allTotal = <Cargo>{
			name: 'Total',
			trips: 0,
			on_ship: 0,
			delivered: 0,
			total: 0,
		};
		getTripData().forEach((i) => {
			if (Array.isArray(i.cargo)) {
				// If multiple types of cargo in one ship
				// Todo: DRY cleanup
				i.cargo.forEach((j) => {
					if (sums.find((c) => c.name === j.cargo) == null) {
						sums.push({
							name: j.cargo,
							trips: 0,
							on_ship: 0,
							delivered: 0,
							total: 0,
						});
					}
					const c = sums.find((c) => c.name === j.cargo);
					i.status === 'Shipped'
						? (c.on_ship += j.cargo_size)
						: (c.delivered += j.cargo_size);
					c.total += j.cargo_size;
					c.trips += 1;

					i.status === 'Shipped'
						? (allTotal.on_ship += j.cargo_size)
						: (allTotal.delivered += j.cargo_size);
					allTotal.total += j.cargo_size;
					allTotal.trips += 1;
				});
			} else {
				// If single type of cargo in one ship
				if (sums.find((c) => c.name === i.cargo) == null) {
					sums.push({
						name: i.cargo,
						trips: 0,
						on_ship: 0,
						delivered: 0,
						total: 0,
					});
				}
				const c = sums.find((c) => c.name === i.cargo);
				i.status === 'Shipped'
					? (c.on_ship += i.cargo_size)
					: (c.delivered += i.cargo_size);
				c.total += i.cargo_size;
				c.trips += 1;

				i.status === 'Shipped'
					? (allTotal.on_ship += i.cargo_size)
					: (allTotal.delivered += i.cargo_size);
				allTotal.total += i.cargo_size;
				allTotal.trips += 1;
			}
		});
		this.dataset.push(...sums, allTotal);
	}
}
