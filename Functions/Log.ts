import fs from 'fs';

class Log {
	ip: string;
	date: Date;
	request: any;
	pc: boolean;
	constructor(ip: string, request: string, pc: boolean) {
		this.ip = ip;
		this.date = new Date();
		this.request = request;
		this.pc = pc;
	}
}

function log(localPath: string, req: any) {
	const month = new Date().getMonth() + 1;
	if (!fs.existsSync(localPath + `/logs/${month}.json`)) {
		fs.writeFileSync(localPath + `/logs/${month}.json`, JSON.stringify([]));
	}

	const pc = req.body.pc;
	const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).substring(7);
	const request = req.body;

	const infos = JSON.parse(fs.readFileSync(localPath + `/logs/${month}.json`).toString());

	infos.push(new Log(ip, request, pc));
	fs.writeFileSync(localPath + `/logs/${month}.json`, JSON.stringify(infos));
}

export default log;