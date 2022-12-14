import { Component, OnInit } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-admin-layout',
	templateUrl: './admin-layout.component.html',
	styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
	private _router: Subscription;
	private lastPoppedUrl: string;
	private readonly yScrollStack: number[] = [];

	constructor(public location: Location, private readonly router: Router) {}

	ngOnInit() {
		const isWindows = navigator.platform.includes('Win');

		if (isWindows) {
			// if we are on windows OS we activate the perfectScrollbar function

			document
				.getElementsByTagName('body')[0]
				.classList.add('perfect-scrollbar-on');
		} else {
			document
				.getElementsByTagName('body')[0]
				.classList.remove('perfect-scrollbar-off');
		}
		const elemMainPanel = document.querySelector('.main-panel');
		const elemSidebar = document.querySelector('.sidebar .sidebar-wrapper');

		this.location.subscribe((ev: PopStateEvent) => {
			this.lastPoppedUrl = ev.url;
		});
		this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationStart) {
				if (event.url !== this.lastPoppedUrl) {
					this.yScrollStack.push(window.scrollY);
				}
			} else if (event instanceof NavigationEnd) {
				if (event.url === this.lastPoppedUrl) {
					this.lastPoppedUrl = undefined;
					window.scrollTo(0, this.yScrollStack.pop());
				} else window.scrollTo(0, 0);
			}
		});
		this._router = this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				elemMainPanel.scrollTop = 0;
				elemSidebar.scrollTop = 0;
			});
		// if (window.matchMedia('(min-width: 960px)').matches && !this.isMac()) {
		//   let ps = new PerfectScrollbar(elemMainPanel);
		//   ps = new PerfectScrollbar(elemSidebar);
		// }
	}

	ngAfterViewInit() {
		this.runOnRouteChange();
	}

	isMap(path) {
		let titlee = this.location.prepareExternalUrl(this.location.path());
		titlee = titlee.slice(1);
		if (path === titlee) {
			return false;
		} else {
			return true;
		}
	}

	runOnRouteChange(): void {
		if (window.matchMedia('(min-width: 960px)').matches && !this.isMac()) {
			const elemMainPanel = document.querySelector('.main-panel');
			const ps = new PerfectScrollbar(elemMainPanel);
			ps.update();
		}
	}

	isMac(): boolean {
		let bool = false;
		const platform = navigator.platform.toUpperCase();
		if (platform.includes('MAC') || platform.includes('IPAD')) {
			bool = true;
		}
		return bool;
	}
}
