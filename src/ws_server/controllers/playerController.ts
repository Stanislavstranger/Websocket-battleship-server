import WebSocket from 'ws';
import { validatePlayerRegistration } from '../utils/validationUtils';
import { registerPlayer } from '../services/userService';
import { Player } from '../models/Player';

export const handlePlayerRegistration = (data: Player, ws: WebSocket): void => {
	const validationResult = validatePlayerRegistration(data);
	if (!validationResult) {
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
};

export const handleRoomCreation = (data: Player, ws: WebSocket): void => {
	const responseData = {
		type: 'create_game',
		data: JSON.stringify({
			idGame: 1,
			idPlayer: 0,
		}),
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);
};

export const handleAddUserToRoom = (data: Player, ws: WebSocket): void => {
	console.log(data);
};
