import WebSocket from 'ws';
import {
	handleAddUserToRoom,
	handlePlayerRegistration,
	handleRoomCreation,
} from '../controllers/playerController';
import { players } from '../services/userService';

export const handleWebSocketConnection = (ws: WebSocket): void => {
	console.log('New WebSocket connection');

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
					handleAddUserToRoom(parsedMessage, ws);
					break;
				default:
					console.log('Unknown command type');
					break;
			}
		} catch (error) {
			console.error('Error parsing message:', error);
		}
	});

	ws.on('close', () => {
		console.log('WebSocket connection closed');
	});
};
