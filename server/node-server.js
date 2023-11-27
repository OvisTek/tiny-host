const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const httpsLocalhost = require("https-localhost")();

// https port
const httpPort = 443;

const app = express();

// allow all cross origin stuff through
app.use((req, res, next) => {
	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST");
	res.append("Access-Control-Allow-Headers", "Content-Type");

	return next();
});

app.use(express.static('html'));

httpsLocalhost.getCerts().then((certs) => {
	https.createServer(certs, app).listen(httpPort, () => {
		console.log("HTTPS Server Launched on Port " + httpPort);
		console.log("Visit https://localhost/index.html");
	});
}).catch((err) => {
	console.error(err);
});