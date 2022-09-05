import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Location } from '@angular/common';

@Component({
	// moduleId: module.id,
	selector: 'navbar-cmp',
	templateUrl: 'navbar.component.html',
})
export class NavbarComponent implements OnInit {
	private listTitles: any[];
	location: Location;
	private toggleButton: any;
	private sidebarVisible = true;

	constructor(location: Location, private readonly element: ElementRef) {
		this.location = location;
		this.sidebarVisible = false;
	}

	ngOnInit() {
		this.listTitles = ROUTES.filter((listTitle) => listTitle);
		const navbar: HTMLElement = this.element.nativeElement;
		this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
	}

	sidebarOpen(sidebar) {
		setTimeout(function () {
			this.toggleButton.classList.add('toggled');
		}, 500);
		sidebar.classList.add('nav-open');

		this.sidebarVisible = true;
	}

	sidebarClose(sidebar) {
		this.toggleButton.classList.remove('toggled');
		this.sidebarVisible = false;
		sidebar.classList.remove('nav-open');
	}

	sidebarToggle() {
		const sidebar = document.getElementsByClassName('sidebar')[0];
		if (!this.sidebarVisible) {
			this.sidebarOpen(sidebar);
		} else {
			this.sidebarClose(sidebar);
		}
	}

	getTitle() {
		let titlee = this.location.prepareExternalUrl(this.location.path());
		if (titlee.charAt(0) === '#') {
			titlee = titlee.slice(1);
		}

		for (let item = 0; item < this.listTitles.length; item++) {
			if (this.listTitles[item].path === titlee) {
				return this.listTitles[item].title;
			}
		}
		return 'Dashboard';
	}
}
