import WebSocket from 'ws';
import 'colors';
import handlePlayerRegistration from '../controllers/playerController';
import { handleGameCreation } from '../controllers/gameController';
import db from '../data/db';
import handleRoomUpdate from '../controllers/roomController';
import { addPlayerToRoom, createRoom } from '../services/roomService';
import { addConnection, removeConnection } from '../services/connectionService';

export const handleWebSocketConnection = (ws: WebSocket): void => {
	console.log('👉👈 New WebSocket connection'.green.inverse);

	const connectionId = addConnection(ws as any);
	const { players, rooms, games } = db;
	ws.on('message', (message: string) => {
		try {
			const parsedMessage = JSON.parse(message);
			console.log('Received message:', parsedMessage);
			switch (parsedMessage.type) {
				case 'reg':
					handlePlayerRegistration(JSON.parse(parsedMessage.data), ws);
					console.log(db.connections);
					if (rooms[rooms.length - 1]) {
						handleRoomUpdate();
					}
					break;
				case 'create_room':
					createRoom(players[players.length - 1].id);
					handleRoomUpdate();
					break;
				case 'add_user_to_room':
					addPlayerToRoom(JSON.parse(parsedMessage.data), players[players.length - 1].id);
					handleGameCreation(players[players.length - 1], ws);
					break;
				case 'add_ships':
					/* addPlayerToRoom(JSON.parse(parsedMessage.data), players[players.length - 1].id);
					handleGameStart(players[players.length - 1], ws); */
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
		removeConnection(connectionId);
		console.log(db.connections);
	});
};
