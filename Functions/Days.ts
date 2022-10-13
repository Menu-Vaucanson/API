import fs from 'fs';

import log from './Log';

function Days(req: any, res: any, localPath: string) {
	const days = req.body.days;

	if (!days?.length) {
		res.status(400).json({ error: 1, msg: 'No given days' });
		return;
	}

	if (days.length > 14) {
		res.status(413).json({ error: 1, msg: 'More than 14 days were requested' });
		return;
	}

	const D = days.map((menu: any) => {
		const day = menu?.day?.toString();
		const month = menu?.month?.toString();

		if (typeof day == 'undefined') {
			return { error: 1, msg: 'Day not specified for this menu' };
		}

		if (typeof month == 'undefined') {
			return { error: 1, msg: 'Month not specified for this menu' };
		}

		if (isNaN(day) || day > 31 || day < 1) {
			return { error: 1, msg: 'Invalid day specified for this menu' };
		}

		if (isNaN(month) || month > 12 || month < 1) {
			return { error: 1, msg: 'Invalid month specified for this menu' };
		}

		if (!fs.existsSync(localPath + `menus/${month}/${day}.json`)) {
			return { error: 1, msg: 'Menu not found' };
		}
		return { error: 0, data: JSON.parse(fs.readFileSync(localPath + `menus/${month}/${day}.json`).toString()) };
	});

	if (!D.length) {
		res.status(400).json({ error: 1, msg: 'Invalid request' });
		return;
	}

	res.status(200).json({ error: 0, data: D });
	const month = days[0]?.month?.toString();
	if (month) {
		log(localPath, req);
	}
}

export default Days;