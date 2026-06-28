function formatISODate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getDayOptions() {
	const today = new Date();
	const formatLabel = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

	const options = [];

	for (let offset = 1; offset <= 7; offset++) {
		const date = new Date(today);
		date.setDate(date.getDate() + offset);
		const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
		options.push({ label: `${dayName} (${formatLabel(date)})`, value: formatISODate(date) });
	}

	options.push({ label: 'Other / Later', value: 'other' });

	return options;
}

module.exports = { getDayOptions, formatISODate };