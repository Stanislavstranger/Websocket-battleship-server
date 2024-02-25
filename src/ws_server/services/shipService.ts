import { handleGameStart } from '../controllers/gameController';
import db from '../data/db';
import { Ships } from '../models/models';

export const checkIfBothPlayersHaveShips = (gameId: number): Ships[] | undefined => {
	const shipsForGame = db.ships.filter((ship) => ship.gameId === gameId);
	const playersWithShips = new Set(shipsForGame.map((ship) => ship.indexPlayer));
	if (playersWithShips.size === 2) {
		return shipsForGame;
	}
};

export const addShips = (data: Ships, ws: WebSocket): void => {
	const { gameId, ships, indexPlayer } = data;
	const shipData = {
		gameId,
		ships,
		indexPlayer,
		ws,
	};
	db.ships.push(shipData);

	const players = checkIfBothPlayersHaveShips(gameId);
	if (players)
		players.map((player) => handleGameStart(player.ships, player.indexPlayer, player.ws as any));
};

export const getShipsByGameId = (gameId: number): Ships[] => {
	return db.ships.filter((ship) => ship.gameId === gameId);
};

export const getShipsByGameIdAndByPlayerId = (gameId: number, playerId: number): Ships[] => {
	return db.ships.filter((ship) => ship.gameId === gameId && ship.indexPlayer !== playerId);
};
