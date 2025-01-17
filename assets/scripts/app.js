'use strict';

import { fetchData, url } from './api.js';
import * as module from './module.js';

const addEventonElements = function (elements, eventType, callback) {
	for (const element of elements) element.addEventListener(eventType, callback);
};

// Alternar a pesquisa no mobile (abrir e voltar)
const searchView = document.querySelector('[data-search-view]');
const searchTogglers = document.querySelectorAll('[data-search-toggler]');

const toggleSearch = () => searchView.classList.toggle('active');
addEventonElements(searchTogglers, 'click', toggleSearch);

// Integração da Pesquisa do usuário
const searchField = document.querySelector('[data-search-field]');
const searchResult = document.querySelector('[data-search-result]');

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener('input', function () {
	searchTimeout ?? clearTimeout(searchTimeout);

	if (!searchField.value) {
		searchResult.classList.remove('active');
		searchResult.innerHTML = '';
		searchField.classList.remove('searching');
	} else {
		searchField.classList.add('searching');
	}

	if (searchField.value) {
		searchTimeout = setTimeout(() => {
			fetchData(url.geo(searchField.value), function (locations) {
				searchField.classList.remove('searching');
				searchResult.classList.add('active');
				searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>
                `;

				const items = [];

				for (const { name, lat, lon, country, state } of locations) {
					const searchItem = document.createElement('li');
					searchItem.classList.add('view-item');

					searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>

                        <div>
                            <p class="item-title">${name}</p>

                            <p class="label-2 item-subtitle">${state || ''}, ${country}</p>
                        </div>

                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} clima" data-search-toggler></a>
                    `;

					searchResult.querySelector('[data-search-list]').appendChild(searchItem);
					items.push(searchItem.querySelector('[data-search-toggler]'));
				}

				addEventonElements(items, 'click', function () {
					toggleSearch();
					searchResult.classList.remove('active');
				});
			});
		}, searchTimeoutDuration);
	}
});

const container = document.querySelector('[data-container]');
const loading = document.querySelector('[data-loading]');
const currentLocationBtn = document.querySelector('[data-current-location-btn]');

const errorContent = document.querySelector('[data-error-content]');

// Processar os dados de clima no HTML
export const updateWeather = function (lat, lon) {
	console.log(`Atualizando o clima para: Latitude: ${lat}, Longitude: ${lon}`);
	// loading.style.display = 'grid';
	container.style.overflowY = 'hidden';
	// container.classList.remove('fade-in');
	errorContent.style.display = 'none';

	const currentWeatherSection = document.querySelector('[data-current-weather]');
	const highlightSection = document.querySelector('[data-highlights]');
	const hourlySection = document.querySelector('[data-hourly-forecast]');
	const forecastSection = document.querySelector('[data-5-day-forecast]');

	currentWeatherSection.innerHTML = '';
	highlightSection.innerHTML = '';
	hourlySection.innerHTML = '';
	forecastSection.innerHTML = '';

	if (window.location.hash === '#/current-location') {
		currentLocationBtn.setAttribute('disabled', '');
	} else {
		currentLocationBtn.removeAttribute('disabled');
	}

	// Clima Agora
	fetchData(url.currentWeather(lat, lon), function (currentWeather) {
		const {
			weather,
			dt: dateUnix,
			sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
			main: { temp, feels_like, pressure, humidity },
			visibility,
			timezone,
		} = currentWeather;

		const [{ description, icon }] = weather;
		console.log(description);
		console.log(icon);
		console.log('Description and ico');

		const card = document.createElement('div');
		card.classList.add('card', 'card-lg', 'current-weather-card');

		card.innerHTML = `
            <h2 class="title-2 card-title">Agora</h2>

            <div class="weapper">
                <p class="heading">${parseInt(temp)}&deg;<sup>C</sup></p>

                <img src="./assets/images/icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon"/>
            </div>

            <p class="body-3">${description}</p>
            <ul class="meta-list">
                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>
                    <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
                </li>
                <li class="meta-item">
                    <span class="m-icon">location_on</span>
                    <p class="title-3 meta-text" data-location></p>
                </li>
            </ul>`;

		fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
			card.querySelector('[data-location]').innerHTML = `${name} - ${country}`;
		});
		currentWeatherSection.appendChild(card);

		// #BUG: Buscar cidade, estado e país
		// fetchData(url.geo(searchField.value), function ([{ name, state, country }]) {
		// 	if (name !== state) {
		// 		card.querySelector('[data-location]').innerHTML = `${name}, ${state} - ${country}`;
		// 	} else {
		// 		card.querySelector('[data-location]').innerHTML = `${name} - ${country}`;
		// 	}
		// });
	});
};

export const error404 = function () {};
