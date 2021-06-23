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

const root = path.join(__dirname, "/html");

app.use((req, res, next) => {
	const file = (req.url.endsWith(".html") ? req.url : (req.url.endsWith(".js") ? req.url : req.url + ".js"));

	fs.stat(path.join(root, file),
		(err, _) => {
			if (!err) {
				res.sendFile(file, { root });
			}
			else {
				next();
			}
		}
	);
});

httpsLocalhost.getCerts().then((certs) => {
	https.createServer(certs, app).listen(httpPort, () => {
		console.log("HTTPS Server Launched on Port " + httpPort);
		console.log("Visit https://localhost/index.html");
	});
}).catch((err) => {
	console.error(err);
});