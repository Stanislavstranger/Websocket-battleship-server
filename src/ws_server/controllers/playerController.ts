import WebSocket from 'ws';
import { validatePlayerRegistration } from '../utils/validationUtils';
import { Player } from '../models/models';
import db from '../data/db';
import { WriteStream } from 'tty';

const handlePlayerRegistration = (data: Player, ws: WebSocket): void => {
	const validationResult = validatePlayerRegistration(data, ws as any);
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
	return;
};

export default handlePlayerRegistration;
