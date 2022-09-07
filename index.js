const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();

const { Month } = require('./Functions/Month');
const { Day } = require('./Functions/Day');
const { Rate } = require('./Functions/Rate');
const { RateEvening } = require('./Functions/RateEvening');
const { getRates } = require('./Functions/getRates');
const { getRatesEvening } = require('./Functions/getRatesEvening');

const localPath = '/home/pi/';

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
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
		return res.sendStatus(400);
	}
	next();
});

app.get('/', (req, res) => {
	res.status(200).json({ error: 0, msg: 'Online !' });
});

app.get('/menus', (req, res) => {
	res.status(200).json({ error: 0, msg: 'To access a menu, get /menus/month/day/. To access all the month menus, get /menus/month' });
});

app.get('/menus/:month/:day', (req, res) => {
	Day(req, res, localPath);
});

app.get('/menus/:month', (req, res) => {
	Month(req, res, localPath);
});

app.post('/rates/:month/:day', (req, res) => {
	Rate(req, res, localPath);
});

app.get('/rates/:month/:day', (req, res) => {
	getRates(req, res, localPath);
});

app.post('/ratesEvening/:month/:day', (req, res) => {
	RateEvening(req, res, localPath);
});

app.get('/ratesEvening/:month/:day', (req, res) => {
	getRatesEvening(req, res, localPath);
});