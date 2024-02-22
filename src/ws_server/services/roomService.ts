import db from '../data/db';
import { Rooms } from '../models/models';

export const createRoom = (playerId: number): Rooms => {
	const room = { id: db.rooms.length + 1, players: [playerId], gameId: db.games.length + 1 };
	db.rooms.push(room);
	console.log(db);
	return room;
};

export const addPlayerToRoom = (roomId: number, playerId: number): void => {
	const room = db.rooms.find((room) => room.id === roomId);
	if (room) {
		room.players.push(playerId);
	}
	console.log(db);
};
