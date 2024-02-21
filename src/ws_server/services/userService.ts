import db from '../data/db';
import { Player, Players, Rooms } from '../models/models';

export const createPlayer = (name: string, password: string): Players => {
	const player = { id: db.players.length + 1, name, password };
	db.players.push(player);
	return player;
};

export const getPlayerByNameAndPassword = (name: string, password: string): Player | undefined => {
	return db.players.find((player) => player.name === name && player.password === password);
};

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
