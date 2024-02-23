import WebSocket from 'ws';
import { Players } from '../models/models';

export const handleGameCreation = (player: Players, ws: WebSocket): void => {
	const responseData = {
		type: 'create_game',
		data: JSON.stringify({
			idGame: 1,
			idPlayer: player.id,
		}),
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);
};
