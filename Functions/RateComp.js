class Rate {
	constructor(rate, ip, pc) {
		this.rate = rate;
		this.ip = ip;
		this.date = new Date();
		this.pc = pc;
	}
}

module.exports = { Rate };