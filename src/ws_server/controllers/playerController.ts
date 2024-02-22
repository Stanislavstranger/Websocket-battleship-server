import WebSocket from 'ws';
import { validatePlayerRegistration } from '../utils/validationUtils';
import { createPlayer } from '../services/playerService';
import { Player } from '../models/models';
import handleRoomUpdate from './roomController';
import db from '../data/db';

const handlePlayerRegistration = (data: Player, ws: WebSocket): void => {
	const validationResult = validatePlayerRegistration(data);
	if (!validationResult) {
		const responseData = {
			type: 'reg',
			data: JSON.stringify({
				error: true,
				errorText: "Password doesn't match",
			}),
			id: 0,
		};
		const response = JSON.stringify(responseData);
		console.log('🚀 ~ handlePlayerRegistration ~ response:', response);
		ws.send(response);
		return;
	}

	const { name } = data;
	const responseData = {
		type: 'reg',
		data: JSON.stringify({
			name,
			index: 0,
			error: false,
			errorText: '',
		}),
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);

	/* handleRoomUpdate(db.players[length - 1], ws); */
};

export default handlePlayerRegistration;
