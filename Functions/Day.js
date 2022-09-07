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

function Day(req, res, localPath) {
	const month = parseInt(req.params.month);
	const day = parseInt(req.params.day);
	if (!fs.existsSync(localPath + `menus/${month}/${day}.json`)) {
		res.status(400).json({ error: 1, msg: 'Menu not found' });
		return;
	}
	const menu = JSON.parse(fs.readFileSync(localPath + `menus/${month}/${day}.json`));
	res.status(200).json({ error: 0, data: menu });
	log(localPath, month, day);
}

module.exports = { Day };