import cors from 'cors';
import express from 'express';
import fs from 'fs';
import https from 'https';
const app = express();

import Day from './Functions/Day';
import Days from './Functions/Days';
import getRates from './Functions/getRates';
import getRatesEvening from './Functions/getRatesEvening';
import Month from './Functions/Month';
import Rate from './Functions/Rate';
import rateEvening from './Functions/RateEvening';

const localPath = '/home/pi/datas/';

const key = fs.readFileSync('../certs/selfsigned.key');
const cert = fs.readFileSync('../certs/selfsigned.crt');
const options = {
	key: key,
	cert: cert
};

const server = https.createServer(options, app);

server.listen(8080, () => {
	console.log('Server started !');
});


app.use(express.json());
app.use(cors());
app.use((err: { status: number }, req: any, res: any, next: Function) => {
	if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
		return res.sendStatus(400);
	}
	next();
});

app.get('/', (req: any, res: any) => {
	res.status(200).json({ error: 0, msg: 'Online !' });
});

app.get('/menus', (req: any, res: any) => {
	res.status(200).json({ error: 0, msg: 'To access a menu, get /menus/month/day/. To access all the month menus, get /menus/month' });
});

app.post('/menus', (req: any, res: any) => {
	Days(req, res, localPath);
});

app.get('/menus/:month/:day', (req: any, res: any) => {
	Day(req, res, localPath);
});

app.get('/menus/:month', (req: any, res: any) => {
	Month(req, res, localPath);
});

app.post('/rates/:month/:day', (req: any, res: any) => {
	Rate(req, res, localPath);
});

app.get('/rates/:month/:day', (req: any, res: any) => {
	getRates(req, res, localPath);
});

app.post('/ratesEvening/:month/:day', (req: any, res: any) => {
	rateEvening(req, res, localPath);
});

app.get('/ratesEvening/:month/:day', (req: any, res: any) => {
	getRatesEvening(req, res, localPath);
});