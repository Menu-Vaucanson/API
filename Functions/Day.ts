import fs from 'fs';

import log from './Log';


function Day(req: any, res: any, localPath: string) {
	const month = parseInt(req.params.month);
	const day = parseInt(req.params.day);
	if (!fs.existsSync(localPath + `menus/${month}/${day}.json`)) {
		res.status(404).json({ error: 1, msg: 'Menu not found' });
		return;
	}
	const menu = JSON.parse(fs.readFileSync(localPath + `menus/${month}/${day}.json`).toString());
	res.status(200).json({ error: 0, data: menu });
	log(localPath, req);
}

export default Day;