import WebSocket from 'ws';
import { Ships } from '../models/models';
import db from '../data/db';
import { getPlayerById } from '../services/playerService';
import { createGame } from '../services/gameService';

export const handleGameCreation = (): void => {
	const roomsWithTwoPlayer = db.rooms.filter((room) => room.players.length === 2);
	const data = roomsWithTwoPlayer.map((room) => {
		createGame(room.players[0], room.players[1]);
		room.players.forEach((playerId) => {
			const ws = getPlayerById(playerId);
			const responseData = {
				type: 'create_game',
				data: JSON.stringify({
					idGame: db.games.length + 1,
					idPlayer: playerId,
				}),
				id: 0,
			};
			const response = JSON.stringify(responseData);
			if (ws) ws.ws.send(response);
		});
	});
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
