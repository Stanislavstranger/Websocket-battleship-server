import WebSocket from 'ws';
import { Players, Ships } from '../models/models';

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

export const handleGameStart = (data: Ships, ws: WebSocket): void => {
	const { gameId, ships, indexPlayer } = data;
	const responseData = {
		type: 'start_game',
		data: {
			ships,
			currentPlayerIndex: indexPlayer,
		},
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);
};
