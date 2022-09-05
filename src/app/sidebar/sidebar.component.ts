import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
	path: string;
	title: string;
	icon: string;
	class: string;
}
export const ROUTES: RouteInfo[] = [
	{ path: '/trips', title: 'Trips', icon: 'fa-solid fa-ship', class: '' },
	{
		path: '/cargo',
		title: 'Cargo',
		icon: 'fa-solid fa-boxes-stacked',
		class: '',
	},
];

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
	menuItems: any[];

	ngOnInit() {
		this.menuItems = ROUTES.filter((menuItem) => menuItem);
	}

	isMobileMenu() {
		if ($(window).width() > 991) {
			return false;
		}
		return true;
	}
}
