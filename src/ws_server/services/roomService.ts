import db from '../data/db';
import { Rooms } from '../models/models';
import { getPlayerByWs } from './playerService';

const playerCreatedRooms: { [playerId: number]: number } = {};

export const createRoom = (ws: WebSocket): Rooms | void => {
	const player = getPlayerByWs(ws);
	if (!player) return;

	const room = {
		id: db.rooms.length + 1,
		players: [player.playerId],
		gameId: db.games.length + 1,
	};
	db.rooms.push(room);
	playerCreatedRooms[player.playerId] = room.id;
	return room;
};

export const addPlayerToRoom = (roomId: { indexRoom: number }, ws: WebSocket): void => {
	const room = db.rooms.find((room) => room.id === roomId.indexRoom);
	const player = getPlayerByWs(ws);
	if (room && room.players.length < 2 && player && room.players[0] !== player.playerId) {
		if (playerCreatedRooms[player.playerId]) {
			deleteRoomByRoomId(playerCreatedRooms[player.playerId]);
			delete playerCreatedRooms[player.playerId];
		}
		room.players.push(player.playerId);
	}
};

export const deleteRoomByRoomId = (roomId: number): void => {
	const index = db.rooms.findIndex((room) => room.id === roomId);
	if (index !== -1) {
		db.rooms.splice(index, 1);
	}
};

export const deleteRoomByPlayerId = (playerId: number): void => {
	const roomId = playerCreatedRooms[playerId];
	if (roomId) {
		deleteRoomByRoomId(roomId);
		delete playerCreatedRooms[playerId];
	}
};

export const isRoom = (): boolean => {
	return db.rooms.length > 0;
};
