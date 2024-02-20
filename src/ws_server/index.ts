import 'dotenv/config';
import 'colors';
import WebSocket from 'ws';

const PORT = process.env.PORT || 4000;

const wss = new WebSocket.Server({ port: Number(PORT) });

wss.on('listening', () => {
	console.log(`⚙️  Server running on the http://localhost:${PORT}`.green.inverse);
});

wss.on('connection', (ws: WebSocket) => {
	console.log('Client connected');

	ws.on('message', (message: WebSocket.Data) => {
		console.log('received: %s', message);

		try {
			const data = JSON.parse(message.toString());

			let responseData;
			if (data.type === 'reg') {
				const name = JSON.parse(data.data);
				responseData = {
					type: 'reg',
					data: JSON.stringify({
						name: name.name,
						index: 0,
						error: false,
						errorText: '',
					}),
					id: 0,
				};
			} else {
				responseData = {
					type: 'error',
					data: {
						error: true,
						errorText: 'Unknown command type',
					},
					id: 0,
				};
			}

			const response = JSON.stringify(responseData);
			ws.send(response);
		} catch (error) {
			console.error('Error parsing message:', error);
			const response = JSON.stringify({
				type: 'error',
				data: {
					error: true,
					errorText: 'Invalid JSON format',
				},
				id: 0,
			});
			ws.send(response);
		}
	});
});
