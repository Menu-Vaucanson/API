import fs from 'fs';

function getRatesEvening(req: any, res: any, localPath: string) {
	const month = parseInt(req.params.month);
	const day = parseInt(req.params.day);
	if (!fs.existsSync(localPath + `ratesEvening/${month}/${day}.json`)) {
		res.status(404).json({ error: 1, msg: 'Rates not found' });
		return;
	}
	const rates = JSON.parse(fs.readFileSync(localPath + `ratesEvening/${month}/${day}.json`).toString());

	let average = 0;
	if (rates.length == 1) {
		average = rates[0].rate;
	}

	rates.forEach((rate: { rate: number }) => {
		average += rate.rate;
	});
	average = parseFloat((average / rates.length).toFixed(1));

	res.status(200).json({ error: 0, rate: average });
}

export default getRatesEvening;