const fs = require('fs');

function Day(req, res, localPath) {
	const month = parseInt(req.params.month);
	const day = parseInt(req.params.day);
	if (!fs.existsSync(localPath + `menus/${month}/${day}.json`)) {
		res.status(400).json({ error: 1, msg: 'Menu not found' });
		return;
	}
	const menu = JSON.parse(fs.readFileSync(localPath + `menus/${month}/${day}.json`));
	res.status(200).json({ error: 0, data: menu });
}

module.exports = { Day };