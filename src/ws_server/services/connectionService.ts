import db from '../data/db';
import { getPlayerByWs } from './playerService';

const { players } = db;

export const addConnection = (ws: WebSocket): void => {
	db.connections.push({ playerId: players[players.length - 1].id, ws });
	console.log(db.connections);
};

export const removeConnection = (id: number): void => {
	const index = db.connections.findIndex((connection) => connection.playerId === id);
	if (index !== -1) {
		db.connections.splice(index, 1);
	}
	console.log(db.connections);
};
