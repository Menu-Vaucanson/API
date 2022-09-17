const fs = require('fs');


class Log {
	constructor(ip, request, pc) {
		this.ip = ip;
		this.date = new Date();
		this.request = request;
		this.pc = pc;
	}
}

function log(localPath, month, req) {
	if (!fs.existsSync(localPath + `/logs/${month}.json`)) {
		fs.writeFileSync(localPath + `/logs/${month}.json`, JSON.stringify([]));
	}

	const pc = req.body.pc;
	const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).substring(7);
	const request = req.body;

	const infos = JSON.parse(fs.readFileSync(localPath + `/logs/${month}.json`));

	infos.push(new Log(ip, request, pc));
	fs.writeFileSync(localPath + `/logs/${month}.json`, JSON.stringify(infos));
}

module.exports = { log };