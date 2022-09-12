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
	size: number;
	trips: number;
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
	colHeaders = ['Commodity', 'Total Shipped Size (mt)', 'Number of Shipments'];

	ngOnInit(): void {
		this.getCargo();
	}

	getCargo(): void {
		const sums: Cargo[] = [];
		getTripData().forEach((i) => {
			if (Array.isArray(i.cargo)) {
				// If multiple types of cargo in one ship
				i.cargo.forEach((j) => {
					if (sums.find((c) => c.name === j.cargo) == null) {
						sums.push({ name: j.cargo, size: 0, trips: 0 });
					}
					const c = sums.find((c) => c.name === j.cargo);
					c.size += j.cargo_size;
					c.trips += 1;
				});
			} else {
				// If single type of cargo in one ship
				if (sums.find((c) => c.name === i.cargo) == null) {
					sums.push({ name: i.cargo, size: 0, trips: 0 });
				}
				const c = sums.find((c) => c.name === i.cargo);
				c.size += i.cargo_size;
				c.trips += 1;
			}
		});
		this.dataset.push(...sums);
	}
}
