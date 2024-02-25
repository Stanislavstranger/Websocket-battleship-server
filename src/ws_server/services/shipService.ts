import db from '../data/db';
import { Ships } from '../models/models';

export const addShips = (data: Ships): void => {
	const { gameId, ships, indexPlayer } = data;
	const shipData = {
		gameId,
		ships,
		indexPlayer,
	};
	db.ships.push(shipData);
	console.log(db.ships);
};

export const getShipsByGameId = (gameId: number): Ships[] => {
	return db.ships.filter((ship) => ship.gameId === gameId);
};
