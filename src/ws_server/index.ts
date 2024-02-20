import 'dotenv/config';
import 'colors';
import WebSocket from 'ws';

const PORT = process.env.PORT || 4000;

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
	console.log(`⚙️  Server running on the http://localhost:${PORT}`.green.inverse);

	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	ws.send('Hello, Client!');
});
