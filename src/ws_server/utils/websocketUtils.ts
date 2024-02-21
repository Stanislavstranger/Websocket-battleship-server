import WebSocket from 'ws';
import 'colors';
import handlePlayerRegistration from '../controllers/playerController';
import { players } from '../services/userService';
import handleRoomCreation from '../controllers/roomController';
import handleGameCreation from '../controllers/gameController';

export const handleWebSocketConnection = (ws: WebSocket): void => {
	console.log('👉👈 New WebSocket connection'.green.inverse);

	ws.on('message', (message: string) => {
		try {
			const parsedMessage = JSON.parse(message);
			console.log('Received message:', parsedMessage);
			console.log(players);
			switch (parsedMessage.type) {
				case 'reg':
					handlePlayerRegistration(JSON.parse(parsedMessage.data), ws);
					break;
				case 'create_room':
					handleRoomCreation(parsedMessage, ws);
					break;
				case 'add_user_to_room':
					handleGameCreation(parsedMessage, ws);
					break;
				default:
					console.log('❗ Unknown command type'.red.bgWhite);
					break;
			}
		} catch (error) {
			console.error('❗ Error parsing message:'.red.bgWhite, error);
		}
	});

	ws.on('close', () => {
		console.log('👈👉 WebSocket connection closed'.red.inverse);
	});
};
