'use strict';

const api_key = '1fd03b2a4681b4abd126feacc8a8728f';

// Detecta o idioma do navegador
const userLanguage = navigator.language || navigator.userLanguage;
const lang = userLanguage.split('-')[0]; // Ex: 'pt', 'en', etc.

export const fetchData = function (URL, callback) {
	fetch(`${URL}&appid=${api_key}&lang=${lang}`)
		.then((res) => res.json())
		.then((data) => callback(data));
};

export const url = {
	currentWeather(lat, lon) {
		return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
	},
	forecast(lat, lon) {
		return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
	},
	airPollution(lat, lon) {
		return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
	},
	reverseGeo(lat, lon) {
		return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5&lang=${lang}`;
	},
	geo(query) {
		return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&lang=${lang}`;
	},
};
