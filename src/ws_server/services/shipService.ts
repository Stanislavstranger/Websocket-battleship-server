import db from '../data/db';
import { Ships } from '../models/models';

export const addShip = (
	gameId: number,
	playerId: number,
	positionX: number,
	positionY: number,
	direction: boolean,
	length: number,
	type: 'small' | 'medium' | 'large' | 'huge',
): Ships => {
	const ship = {
		id: db.ships.length + 1,
		gameId,
		playerId,
		positionX,
		positionY,
		direction,
		length,
		type,
	};
	db.ships.push(ship);
	return ship;
};

export const getShipsByGameId = (gameId: number): Ships[] => {
	return db.ships.filter((ship) => ship.gameId === gameId);
};
