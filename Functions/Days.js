const fs = require('fs');

function log(localPath, month, day) {
	if (!fs.existsSync(localPath + `/Logs/${month}/`)) {
		fs.mkdirSync(localPath + `/Logs/${month}/`);
	}
	if (!fs.existsSync(localPath + `/Logs/${month}/${day}.json`)) {
		fs.writeFileSync(localPath + `/Logs/${month}/${day}.json`, JSON.stringify(0));
	}
	let count = JSON.parse(fs.readFileSync(localPath + `/Logs/${month}/${day}.json`));
	count++;
	fs.writeFileSync(localPath + `/Logs/${month}/${day}.json`, JSON.stringify(count));
}

function Days(req, res, localPath) {
	const days = req.body.days;

	if (!days?.length) {
		res.status(400).json({ error: 1, msg: 'No given days' });
		return;
	}

	if (days.length > 14) {
		res.status(400).json({ error: 1, msg: 'More than 14 days were requested.' });
		return;
	}

	const D = days.map((menu, i) => {
		const day = menu?.day?.toString();
		const month = menu?.month?.toString();

		if (typeof day == 'undefined') {
			return { error: 1, msg: 'Day not specified for the ' + i + ' menu.' };
		}
		if (typeof month == 'undefined') {
			return { error: 1, msg: 'Month not specified for the ' + i + ' menu.' };
		}

		if (!fs.existsSync(localPath + `menus/${month}/${day}.json`)) {
			return { error: 1, msg: 'Menu not found' };
		} else {
			log(localPath, month, day);
			return { error: 0, data: JSON.parse(fs.readFileSync(localPath + `menus/${month}/${day}.json`)) };
		}
	});

	if (!D.length) {
		res.status(400).json({ error: 1, msg: 'Invalid request.' });
		return;
	}

	res.status(200).json({ error: 0, data: D });
}

module.exports = { Days };