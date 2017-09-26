const http = require('http');

const PORT = process.env.HTTPS_REDIRECT_PORT || 80;

const REDIRECT_STATUS_CODE = 301;
const REDIRECT_MESSAGE = 'Moved Permanently';

function log(...args) { console.log(...args); }

function answer(req, res) {
	let host = req.headers.host.replace(/:\d+$/, '');
	const location = `https://${host}${req.url}`;

	log(req.method, req.url, '=>', REDIRECT_STATUS_CODE, location);

	res.writeHead(REDIRECT_STATUS_CODE, {
		'Content-Type': 'text/plain',
		'Content-Length': Buffer.byteLength(REDIRECT_MESSAGE),
		'Location': location
	});
	res.end(REDIRECT_MESSAGE);
}

const server = http.createServer(answer);

server.on('error', (err) => {
	err.code === 'EACCES' && log(`Need root to listen to port ${PORT}`);
	err.code === 'EADDRINUSE' && log(`Someone listens to port ${PORT} already`);

	process.exit(0);
});

function dropPrivileges() {
	if (process.getuid() === 0) {
		process.setgid('nobody');
		process.setuid('nobody');
	}
}

server.on('listening', () => {
	log(`Listening to port ${PORT}`);
	dropPrivileges();
});

server.listen(PORT);
