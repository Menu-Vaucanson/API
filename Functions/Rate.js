const fs = require('fs');

function Rate(req, res, localPath) {
	const month = parseInt(req.params.month);
	const day = parseInt(req.params.day);

	if (!fs.existsSync(localPath + `menus/${month}/${day}.json`)) {
		res.status(400).json({ error: 1, msg: 'Menu not found' });
		return;
	}

	if (!fs.existsSync(localPath + `rates/${month}/${day}.json`)) {
		if (!fs.existsSync(localPath + `rates/${month}`)) {
			fs.mkdirSync(localPath + `rates/${month}`);
		}
		fs.writeFileSync(localPath + `rates/${month}/${day}.json`, JSON.stringify([]));
	}

	const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).substring(7);

	const Rates = JSON.parse(fs.readFileSync(localPath + `rates/${month}/${day}.json`));

	if (typeof Rates.find(r => r.ip === ip) != 'undefined') {
		res.status(400).json({ error: 1, msg: 'Rate refused' });
		return;
	}

	const rate = req.body.rate;

	if (typeof rate == 'undefined') {
		res.status(400).json({ error: 1, msg: 'No given rate' });
		return;
	}

	Rates.push({
		ip: ip,
		rate: rate
	});

	fs.writeFileSync(localPath + `rates/${month}/${day}.json`, JSON.stringify(Rates));
	res.status(200).json({ error: 0, msg: 'Success' });
	return;
}

module.exports = { Rate };