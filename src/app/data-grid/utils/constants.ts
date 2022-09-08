import { trips } from '../../../../data/trips';
import { CountryCodes } from '../../../../data/country_codes';
import { LatLongOverrides } from '../../../../data/latlong_overrides';

export const SELECTED_CLASS = 'selected';
export const ODD_ROW_CLASS = 'odd';

export function getTripData() {
	return trips;
}

export function getCountryCodeData() {
	return CountryCodes;
}

export function getLatLongOverrides() {
	return LatLongOverrides;
}
