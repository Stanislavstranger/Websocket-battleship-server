import db from '../data/db';
import { Rooms } from '../models/models';

export const createRoom = (playerId: number, gameId: number): Rooms => {
	const room = { id: db.rooms.length + 1, players: [playerId], gameId };
	db.rooms.push(room);
	return room;
};

export const addPlayerToRoom = (roomId: number, playerId: number): void => {
	const room = db.rooms.find((room) => room.id === roomId);
	if (room) {
		room.players.push(playerId);
	}
};
