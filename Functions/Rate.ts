import fs from 'fs';

import Rate from './RateComp';

function rate(req: any, res: any, localPath: string) {
	const month = parseInt(req.params.month);
	const day = parseInt(req.params.day);

	if (isNaN(month) || month > 12 || month < 1) {
		res.status(400).json({ error: 1, msg: 'Invalid month' });
		return;
	}

	if (isNaN(day) || day > 31 || day < 1) {
		res.status(400).json({ error: 1, msg: 'Invalid day' });
		return;
	}

	if (!fs.existsSync(localPath + `menus/${month}/${day}.json`)) {
		res.status(404).json({ error: 1, msg: 'Menu not found' });
		return;
	}

	if (!fs.existsSync(localPath + `rates/${month}/${day}.json`)) {
		if (!fs.existsSync(localPath + `rates/${month}`)) {
			fs.mkdirSync(localPath + `rates/${month}`);
		}
		fs.writeFileSync(localPath + `rates/${month}/${day}.json`, JSON.stringify([]));
	}

	const r = req.body.rate;

	if (typeof r == 'undefined') {
		res.status(400).json({ error: 1, msg: 'No given rate' });
		return;
	}

	if (r < 0 || r > 5) {
		res.status(400).json({ error: 1, msg: 'Invalid rate: It can only be between 1 and 5.' });
		return;
	}

	const date = JSON.parse(fs.readFileSync(localPath + `menus/${month}/${day}.json`).toString())?.date?.split('/');

	const MenuDate = new Date(date[2], date[1] - 1, date[0], 11, 45, 0);
	const MenuMaxDate = new Date(MenuDate.getFullYear(), MenuDate.getMonth(), MenuDate.getDate() + 7);

	if (new Date() < MenuDate) {
		res.status(403).json({ error: 1, msg: 'Rate refused: This rate is not available before the initial date.' });
		return;
	}

	if (new Date() > MenuMaxDate) {
		res.status(403).json({ error: 1, msg: 'Rate refused: Rates can only be submitted up to 7 days after the original date.' });
		return;
	}

	const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).substring(7);

	const Rates = JSON.parse(fs.readFileSync(localPath + `rates/${month}/${day}.json`).toString());

	if (typeof Rates.find((r: any) => r.ip === ip) != 'undefined') {
		res.status(403).json({ error: 1, msg: 'Rate refused: You have already rate this one.' });
		return;
	}

	Rates.push(new Rate(r, ip, req.body.pc));

	fs.writeFileSync(localPath + `rates/${month}/${day}.json`, JSON.stringify(Rates));
	res.status(200).json({ error: 0, msg: 'Success' });
}

export default rate;