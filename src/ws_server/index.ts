import 'dotenv/config';
import 'colors';
import WebSocket from 'ws';
import { handleWebSocketConnection } from './utils/websocketUtils';

const PORT = process.env.PORT || 4000;

const wss = new WebSocket.Server({ port: Number(PORT) });

wss.on('connection', handleWebSocketConnection);

wss.on('listening', () => {
	console.log(`⚙️  BACKEND: Server running on the http://localhost:${PORT}`.green.inverse);
});
