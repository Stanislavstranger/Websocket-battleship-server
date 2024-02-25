import WebSocket from 'ws';
import db from '../data/db';
import { getPlayerById } from '../services/playerService';
import { createGame } from '../services/gameService';
import { AttackData, AttackFeedbackData, Ship, Ships } from '../models/models';
import {
	checkIfBothPlayersHaveShips,
	getShipsByGameIdAndByPlayerId,
} from '../services/shipService';

export const handleGameCreation = (): void => {
	const roomsWithTwoPlayer = db.rooms.filter((room) => room.players.length === 2);
	const data = roomsWithTwoPlayer.map((room) => {
		const existingGame = db.games.find(
			(game) => game.player1Id === room.players[0] && game.player2Id === room.players[1],
		);
		if (!existingGame) {
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
		}
	});
};

export const handleGameStart = (
	ships: [
		{
			position: {
				x: number;
				y: number;
			};
			direction: boolean;
			length: number;
			type: 'small' | 'medium' | 'large' | 'huge';
		},
	],
	indexPlayer: number,
	ws: WebSocket,
): void => {
	const responseData = {
		type: 'start_game',
		data: JSON.stringify({
			ships: ships,
			currentPlayerIndex: indexPlayer,
		}),
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);
	console.log(db.ships);
};

export const handleAttack = (data: AttackData, ws: WebSocket): void => {
	const players = checkIfBothPlayersHaveShips(data.gameId);
	const shipsData: Ships[] = getShipsByGameIdAndByPlayerId(data.gameId, data.indexPlayer);

	let status: 'miss' | 'killed' | 'shot';
	let shipHit: Ship | undefined;

	for (const shipData of shipsData) {
		shipHit = shipData.ships.find(
			(ship) => ship.position.x === data.x && ship.position.y === data.y,
		);
		if (shipHit) {
			break;
		}
	}

	if (shipHit) {
		status = shipHit.length === 1 ? 'killed' : 'shot';
	} else {
		status = 'miss';
	}

	const feedback: AttackFeedbackData = {
		position: { x: data.x, y: data.y },
		currentPlayer: data.indexPlayer,
		status,
	};

	if (players)
		players.map((player) => {
			player.ws.send(JSON.stringify({ type: 'attack', data: JSON.stringify(feedback), id: 0 }));
		});
};

export const handleTurn = (data: Ships): void => {
	const { indexPlayer } = data;
	const players = checkIfBothPlayersHaveShips(data.gameId);
	let anotherPlayer: Ships[] | undefined;
	if (players) {
		anotherPlayer = players.filter((player) => player.indexPlayer !== indexPlayer);
	}

	if (players)
		players.map((player) => {
			const responseData = {
				type: 'turn',
				data: JSON.stringify({
					currentPlayer: anotherPlayer![0].indexPlayer,
				}),
				id: 0,
			};
			const response = JSON.stringify(responseData);
			player.ws.send(response);
		});
};
