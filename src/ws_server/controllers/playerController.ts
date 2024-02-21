import WebSocket from 'ws';
import { validatePlayerRegistration } from '../utils/validationUtils';
import { players, registerPlayer } from '../services/userService';
import { Player } from '../models/models';
import handleRoomUpdate from './roomController';

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
	const registrationResult = registerPlayer(name, password);
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

	if (players.length > 1) {
		console.log('🚀 ~ handlePlayerRegistration ~ players:', players);
		handleRoomUpdate(registrationResult, ws);
	}
};

export default handlePlayerRegistration;
