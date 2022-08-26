const fs = require('fs');

function getRates(req, res, localPath) {
	const month = parseInt(req.params.month);
	const day = parseInt(req.params.day);
	if (!fs.existsSync(localPath + `rates/${month}/${day}.json`)) {
		res.status(400).json({ error: 1, msg: 'Rates not found' });
		return;
	}
	const rates = JSON.parse(fs.readFileSync(localPath + `rates/${month}/${day}.json`));

	let average = null;
	if (rates.length) {
		average = rates[0].rate;
	}
	rates.forEach((rate, i) => {
		if (!i) return;
		average += rate.rate;
	});
	if (average) {
		average = (average / rates.length).toFixed(1);
	}

	res.status(200).json({ error: 0, rate: average });
}

module.exports = { getRates };