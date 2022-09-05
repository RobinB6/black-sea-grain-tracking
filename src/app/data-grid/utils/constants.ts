import { trips } from '../../../../data/trips';

export const data = [
	[
		false,
		'Tagcat',
		'United Kingdom',
		'Classic Vest',
		'11/10/2020',
		'01-2331942',
		true,
		'172',
		2,
		2,
	],
];

export const SELECTED_CLASS = 'selected';
export const ODD_ROW_CLASS = 'odd';

export function getData() {
	return trips;
}

// vname: "Razoni",
// port_origin: "Odesa",
// departure: "2022-08-01",
// cargo: "corn",
// cargo_size: 26527,
// destination: "Tartus, Syria?",
// status: "Delivered",
// notes: "Original buyer refused delivery, suspected new delivery location"
