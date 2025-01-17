'use_strict';

import { updateWeather, error404 } from './app.js';

const defaultLocation = '#/weather?lat=-15.7934036&lon=-47.8823172'; // Brasília, Brasil

const currentLocation = function () {
	window.navigator.geolocation.getCurrentPosition(
		(res) => {
			const { latitude, longitude } = res.coords;

			updateWeather(`lat=${latitude}`, `lon=${longitude}`);
		},
		(err) => {
			window.location.hash = defaultLocation;
		},
	);
};

const searchedLocation = (query) => updateWeather(...query.split('&'));

const routes = new Map([
	['/current-location', currentLocation],
	['/weather', searchedLocation],
]);

const checkHash = function () {
	const requestURL = window.location.hash.slice(1);

	console.log(`Hash atual: ${requestURL}`);

	const [route, query] = requestURL.includes ? requestURL.split('?') : [requestURL];

	console.log(`Route atual: ${route}`);
	console.log(`Query atual: ${query}`);

	routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener('hashchange', checkHash);

window.addEventListener('load', function () {
	if (!window.location.hash) {
		window.location.hash = '#/current-location';
	} else {
		checkHash();
	}
});
