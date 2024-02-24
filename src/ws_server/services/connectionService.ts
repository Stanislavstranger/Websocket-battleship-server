import db from '../data/db';

const { players } = db;

export const addConnection = (ws: WebSocket): void => {
	db.connections.push({ playerId: players[players.length - 1].id, ws });
};

export const removeConnection = (id: number): void => {
	const index = db.connections.findIndex((connection) => connection.playerId === id);
	if (index !== -1) {
		db.connections.splice(index, 1);
	}
};
