import WebSocket from 'ws';
import 'colors';
import handlePlayerRegistration from '../controllers/playerController';
import { handleAttack, handleGameCreation, handleTurn } from '../controllers/gameController';
import db from '../data/db';
import handleRoomUpdate from '../controllers/roomController';
import { addPlayerToRoom, createRoom, deleteRoomByPlayerId, isRoom } from '../services/roomService';
import { removeConnection } from '../services/connectionService';
import { getPlayerByWs } from '../services/playerService';
import { addShips } from '../services/shipService';

export const handleWebSocketConnection = (ws: WebSocket): void => {
	console.log('👉👈 New WebSocket connection'.green.inverse);

	ws.on('message', (message: string) => {
		try {
			const parsedMessage = JSON.parse(message);
			console.log('Received message:', parsedMessage);
			switch (parsedMessage.type) {
				case 'reg':
					handlePlayerRegistration(JSON.parse(parsedMessage.data), ws);
					isRoom() ? handleRoomUpdate() : undefined;
					break;
				case 'create_room':
					createRoom(ws as any);
					handleRoomUpdate();
					break;
				case 'add_user_to_room':
					addPlayerToRoom(JSON.parse(parsedMessage.data), ws as any);
					handleRoomUpdate();
					handleGameCreation();
					break;
				case 'add_ships':
					addShips(JSON.parse(parsedMessage.data), ws as any);
					handleTurn(JSON.parse(parsedMessage.data));
					break;
				case 'attack':
					handleAttack(JSON.parse(parsedMessage.data), ws);
					handleTurn(JSON.parse(parsedMessage.data));
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
		const connection = getPlayerByWs(ws as any);
		if (connection) {
			removeConnection(connection.playerId);
			deleteRoomByPlayerId(connection?.playerId);
			handleRoomUpdate();
		}
		console.log(db);
	});
};
