import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldHigh from '@amcharts/amcharts4-geodata/worldHigh';

import {
	getCountryCodeData,
	getTripData,
	getLatLongOverrides,
} from '../data-grid/utils/constants';

interface MapData {
	id: string;
	name: string;
	value: number;
	color: string;
}

@Component({
	styleUrls: ['./dashboard.component.scss'],
	templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
	chart: am4maps.MapChart;
	imageSeries: am4maps.MapImageSeries;
	private GeoDataWorldLow = null;
	private am4maps: typeof import('@amcharts/amcharts4/maps');
	private am4core: typeof import('@amcharts/amcharts4/core');

	constructor(private readonly zone: NgZone) {}

	ngAfterViewInit(): void {
		this.zone.runOutsideAngular(() => {
			// Lazy loading of the AMCharts maps, as Angular optimizer breaks it.
			Promise.all([
				import(/* webpackChunkName: "am4core" */ '@amcharts/amcharts4/core'),
				import(/* webpackChunkName: "am4maps" */ '@amcharts/amcharts4/maps'),
				import(
					/* webpackChunkName: "amcharts" */ '@amcharts/amcharts4-geodata/worldLow'
				),
			])
				.then((modules) => {
					this.am4core = modules[0];
					this.am4maps = modules[1];

					this.GeoDataWorldLow = modules[2].default;

					this.setupMap();
				})
				.catch((e) => {
					console.error('Error when creating chart', e);
				});
		});
	}

	ngOnDestroy(): void {
		this.chart.dispose();
	}

	setupMap() {
		this.chart = am4core.create('chartdiv', am4maps.MapChart);
		this.chart.geodata = am4geodata_worldHigh;
		this.chart.projection = new am4maps.projections.NaturalEarth1();

		const polygonSeries = new am4maps.MapPolygonSeries();
		polygonSeries.useGeodata = true;
		polygonSeries.exclude = ['AQ'];
		polygonSeries.data = [
			{
				id: 'UA',
				name: 'Ukraine',
				fill: am4core.color('#005bbb'),
				'fill-hover': am4core.color('#ffd500'),
			},
		];

		const polygonTemplate = polygonSeries.mapPolygons.template;
		polygonTemplate.tooltipText = '{name}';
		polygonTemplate.fill = am4core.color('#80c471');
		polygonTemplate.propertyFields.fill = 'fill';
		// Create hover state and set alternative fill color
		const hs = polygonTemplate.states.create('hover');
		hs.properties.fill = am4core.color('#367B25');

		hs.propertyFields.fill = 'fill-hover';
		this.chart.series.push(polygonSeries);

		const imageSeries = this.chart.series.push(new am4maps.MapImageSeries());
		imageSeries.data = this.generateMapData();
		imageSeries.dataFields.value = 'value';

		const imageTemplate = imageSeries.mapImages.template;

		const overrides = getLatLongOverrides();
		imageTemplate.adapter.add('latitude', function (latitude, target) {
			const context = <any>target.dataItem.dataContext;
			const polygon = polygonSeries.getPolygonById(context.id);
			if (overrides[context.id]) {
				return overrides[context.id].latitude;
			}
			if (polygon) {
				return polygon.visualLatitude;
			}
			return latitude;
		});

		imageTemplate.adapter.add('longitude', function (longitude, target) {
			const context = <any>target.dataItem.dataContext;
			const polygon = polygonSeries.getPolygonById(context.id);
			if (overrides[context.id]) {
				return overrides[context.id].longitude;
			}
			if (polygon) {
				return polygon.visualLongitude;
			}
			return longitude;
		});

		const circle = imageTemplate.createChild(am4core.Circle);
		circle.fillOpacity = 0.7;
		circle.propertyFields.fill = 'color';
		circle.tooltipText = '{name}: [bold]{value}[/]';

		imageSeries.heatRules.push({
			target: circle,
			property: 'radius',
			min: 1,
			max: 10,
			dataField: 'value',
			logarithmic: true,
		});

		this.chart.events.on('ready', (ev) => {
			const ukraine = polygonSeries.getPolygonById('UA');
			ev.target.zoomToMapObject(ukraine, 5, false, 4000);
			setTimeout(function () {
				ukraine.isActive = true;
			}, 1000);
		});

		this.chart.zoomControl = new am4maps.ZoomControl();
		const title = this.chart.titles.create();
		title.text = 'Black Sea Grain Corridor Shipments (Tons)';
		title.fontSize = 20;
		title.marginTop = 20;
		title.opacity = 0.8;
		title.padding(6, 6, 6, 6);
		title.background.fill = am4core.color('#fff');

		this.chart.background.fill = am4core.color('#92b8df');
		this.chart.background.fillOpacity = 1;
	}

	generateMapData(): MapData[] {
		const data = getCountryCodeData().map((c) => {
			return <MapData>{
				id: c.code,
				name: c.name,
				value: 0,
				color: '#364e65',
			};
		});
		getTripData().forEach((i) => {
			const country = i.destination.includes(',')
				? i.destination.split(', ')[1]
				: i.destination;
			const d = data.filter((f) => f.name === country)[0];
			d.value += i.cargo_size;
		});
		return data.filter((f) => f.value > 0);
	}
}
