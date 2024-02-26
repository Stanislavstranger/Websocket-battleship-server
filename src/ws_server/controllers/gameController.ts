import WebSocket from 'ws';
import db from '../data/db';
import { getPlayerById } from '../services/playerService';
import { createGame } from '../services/gameService';
import { AttackData, AttackFeedbackData, RandomAttackData, Ships } from '../models/models';
import {
	checkIfBothPlayersHaveShips,
	getShipsByGameId,
	getShipsByGameIdAndByPlayerId,
} from '../services/shipService';
import { getRandomNumber } from '../utils/getRandomNumber';

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
};

export const handleFinish = (gameId: number, ws: WebSocket, winPlayer: number): void => {
	const players = getShipsByGameId(gameId);
	players.map((player) => {
		const responseData = {
			type: 'finish',
			data: JSON.stringify({
				winPlayer,
			}),
			id: 0,
		};
		const response = JSON.stringify(responseData);
		player.ws.send(response);
	});
};

const checkSurroundingCells = (matrix: number[][], x: number, y: number): boolean => {
	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	for (const [dx, dy] of directions) {
		const newX = x + dx;
		const newY = y + dy;

		if (newX >= 0 && newX < matrix[0].length && newY >= 0 && newY < matrix.length) {
			if (matrix[newY][newX] === 1) {
				return false;
			}
		}
	}

	return true;
};

let lastKilledShip: { x: number; y: number; index: number } | null = null;

const sendMissToServer = (x: number, y: number, currentPlayer: number, ws: WebSocket): void => {
	const feedback: AttackFeedbackData = {
		position: { x, y },
		currentPlayer,
		status: 'miss',
	};

	ws.send(JSON.stringify({ type: 'attack', data: JSON.stringify(feedback), id: 0 }));
};

const markCellsAroundKilledShipAsMiss = (
	matrix: number[][],
	indexPlayer: number,
	ws: WebSocket,
	lastKilledShip: { x: number; y: number },
): void => {
	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	const { x, y } = lastKilledShip;
	if (matrix[y][x] === 2) {
		for (const [dx, dy] of directions) {
			const newX = x + dx;
			const newY = y + dy;

			if (
				newX >= 0 &&
				newX < matrix[0].length &&
				newY >= 0 &&
				newY < matrix.length &&
				matrix[newY][newX] !== 2
			) {
				matrix[newY][newX] = 0;
				sendMissToServer(newX, newY, indexPlayer, ws);
			}
		}
	}
};

export const handleAttack = (data: AttackData, ws: WebSocket): void => {
	const players = checkIfBothPlayersHaveShips(data.gameId);
	const shipsDataWithIndices: { index: number; ship: Ships }[] = getShipsByGameIdAndByPlayerId(
		data.gameId,
		data.indexPlayer,
	);

	let status: 'miss' | 'killed' | 'shot' = 'miss';
	let secondShot: boolean = false;

	for (const { index, ship } of shipsDataWithIndices) {
		const { x, y } = data;
		if (ship.matrix[y][x] === 1) {
			db.ships[index].matrix[y][x] = 2;
			++db.ships[index].isFinish! === 20
				? handleFinish(data.gameId, ws, data.indexPlayer)
				: undefined;

			if (checkSurroundingCells(db.ships[index].matrix, x, y)) {
				status = 'killed';
				secondShot = true;
				lastKilledShip = { x, y, index };
			} else {
				status = 'shot';
				secondShot = true;
			}
			break;
		} else {
			status = 'miss';
		}
	}

	if (status === 'killed' && lastKilledShip) {
		markCellsAroundKilledShipAsMiss(
			db.ships[lastKilledShip.index].matrix,
			data.indexPlayer,
			ws,
			lastKilledShip,
		);
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

	handleTurn(data, secondShot);
};

export const handlerRandomAttack = (data: RandomAttackData, ws: WebSocket): void => {
	const x = getRandomNumber();
	const y = getRandomNumber();
	const { gameId, indexPlayer } = data;
	const dataForAttack: AttackData = {
		x,
		y,
		gameId,
		indexPlayer,
	};
	handleAttack(dataForAttack, ws);
};

export const handleTurn = (data: AttackData, secondShot: boolean = false): void => {
	const { indexPlayer } = data;
	const players = checkIfBothPlayersHaveShips(data.gameId);
	let anotherPlayer: Ships[] | undefined;
	if (players && !secondShot) {
		anotherPlayer = players.filter((player) => player.indexPlayer !== indexPlayer);
	}

	if (players)
		players.map((player) => {
			let currentPlayer = indexPlayer;
			if (anotherPlayer && anotherPlayer.length > 0) {
				currentPlayer = anotherPlayer[0].indexPlayer;
			}
			const responseData = {
				type: 'turn',
				data: JSON.stringify({
					currentPlayer: currentPlayer,
				}),
				id: 0,
			};
			const response = JSON.stringify(responseData);
			player.ws.send(response);
		});
};
