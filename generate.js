const fs = require('node:fs');

const FILENAME = './contacts.csv';

function parseCSVData(data) {
	const lines = data.split('\n');
	const headers = lines.shift().split(',').map((header, i) => header === '\r' ? String(i) : header);

	const parsed = lines.map(line => {
		const parsedLine = {};
		// Split the CSV lines, taking into account that commas can be in quoted values
		const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

		headers.forEach((header, index) => {
			value = values[index];
			if (!value || value === '\r') {
				parsedLine[header] = '';
			} else {
				// Trim and unquote the value
				parsedLine[header] = value.trim().replace(/^"(.*)"$/, '$1');
			}
		});

		return parsedLine;
	});

	return parsed;
}

function formatCityStateZip({ City, State, Zip }) {
	return [City, State, Zip].filter(Boolean).join(' ');
}

async function generate() {
	const data = await fs.promises.readFile(FILENAME, 'utf8');
	const parsed = parseCSVData(data);

	const labels = parsed.map((contact, i) => {
		const label = [];
		// 30 labels per page
		if (i % 30 === 0) {
			label.push('<div class="page">');
		}

		label.push(
			'<div class="label">',
			`  <div class="name">${contact['Name on Envelope']}</div>`,
		);

		if (contact['Address 1']) {
			label.push(`  <div class="address1">${contact['Address 1']}</div>`);
		}

		if (contact['Address 2']) {
			label.push(`  <div class="address2">${contact['Address 2']}</div>`);
		}

		label.push(`  <div class="city">${formatCityStateZip(contact)}</div>`);

		if (contact['Country']) {
			label.push(`  <div class="country">${contact['Country']}</div>`);
		}

		label.push('</div>');
		label.push('');

		// Close the page every 30 labels
		if (i % 30 === 29) {
			label.push('</div>');
		}

		return label.join('\n');
	});

	const output = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Labels to Print</title>
		<link rel="stylesheet" href="style.css">
	</head>
	<body>
		${labels.join('\n')}
	</body>
</html>
	`;

	await fs.promises.writeFile('index.html', output);
}

generate();
