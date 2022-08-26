const fs = require('fs');

function Month(req, res, localPath) {
	const month = parseInt(req.params.month);
	if (!fs.existsSync(localPath + `menus/${month}/`)) {
		res.status(400).json({ error: 1, msg: 'Month not found' });
		return;
	}
	const menu = fs.readdirSync(localPath + `menus/${month}/`).map(m => {
		return m.replace('.json', '');
	});
	res.status(200).json({ error: 0, data: menu });
}

module.exports = { Month };