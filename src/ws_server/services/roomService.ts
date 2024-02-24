import db from '../data/db';
import { Rooms } from '../models/models';
import { getPlayerByWs } from './playerService';

export const createRoom = (ws: WebSocket): Rooms | void => {
	const playerId = getPlayerByWs(ws);
	if (!playerId) return;

	const room = {
		id: db.rooms.length + 1,
		players: [playerId.playerId],
		gameId: db.games.length + 1,
	};
	db.rooms.push(room);
	return room;
};

export const addPlayerToRoom = (roomId: number): void => {
	const room = db.rooms.find((room) => room.id === roomId);
	if (room && room.players.length < 2) {
		room.players.push(db.players[db.players.length - 1].id);
	}
};

export const isRoom = (): boolean => {
	return db.rooms.length > 0;
};
