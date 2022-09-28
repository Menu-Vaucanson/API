class Rate {
	rate: number;
	ip: string;
	date: Date;
	pc: boolean;
	constructor(rate: number, ip: string, pc: boolean) {
		this.rate = rate;
		this.ip = ip;
		this.date = new Date();
		this.pc = pc;
	}
}

export default Rate;