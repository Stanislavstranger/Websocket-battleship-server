import WebSocket from 'ws';
import { validatePlayerRegistration } from '../utils/validationUtils';
import { createPlayer } from '../services/playerService';
import { Player } from '../models/models';
import handleRoomUpdate from './roomController';
import db from '../data/db';

const handlePlayerRegistration = (data: Player, ws: WebSocket): void => {
	const validationResult = validatePlayerRegistration(data);
	if (!validationResult) {
		const response = JSON.stringify({
			type: 'error',
			data: {
				error: true,
				errorText: 'The user already exists. Enter a different name.',
			},
			id: 0,
		});
		ws.send(response);
		return;
	}

	const { name, password } = data;
	const registrationResult = createPlayer(name, password);
	const responseData = {
		type: 'reg',
		data: JSON.stringify({
			name: registrationResult.name,
			index: 0,
			error: false,
			errorText: '',
		}),
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);

	handleRoomUpdate(registrationResult, ws);
};

export default handlePlayerRegistration;
