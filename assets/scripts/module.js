'use strict';

export const weekDayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const getDate = function (dateUnix, timezone) {
	const date = new Date((dateUnix + timezone) * 1000);
	const weekDayName = weekDayNames[date.getUTCDay()];
	const monthName = monthNames[date.getUTCMonth()];

	return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
};

export const getTime = function (timeUnix, timezone) {
	const date = new Date((timeUnix + timezone) * 1000);
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	// const period = hours >= 12 ? 'PM' : 'AM';

	// return `${hours % 12 || 12}:${minutes} ${period}`
	// Formata as horas e minutos no formato de 24 horas (com 2 dígitos para os minutos)
	return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

export const getHours = function (timeUnix, timezone) {
	const date = new Date((timeUnix + timezone) * 1000);
	const hours = date.getUTCHours();
	// const period = hours >= 12 ? 'PM' : 'AM';

	// Exibe as horas no formato de 24 horas (com 2 dígitos)
	return `${hours < 10 ? '0' + hours : hours}`;
};

export const mps_to_kmh = (mps) => {
	const mph = mps * 3600;
	return mph / 1000;
};

export const aqiText = {
	1: {
		level: 'Bom',
		message: 'Qualidade do ar satisfatória, sem risco para a saúde.',
	},
	2: {
		level: 'Aceitável',
		message: 'Qualidade do ar aceitável, com risco moderado para pessoas sensíveis.',
	},
	3: {
		level: 'Moderado',
		message: 'Grupos sensíveis podem ter efeitos à saúde. Público em geral não é afetado.',
	},
	4: {
		level: 'Ruim',
		message: 'Qualidade do ar prejudicial para pessoas sensíveis à poluição.',
	},
	5: {
		level: 'Muito Ruim',
		message: 'Condições de emergência. Toda a população pode ser afetada.',
	},
};
