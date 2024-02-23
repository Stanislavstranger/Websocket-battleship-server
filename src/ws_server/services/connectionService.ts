import db from '../data/db';

export const addConnection = (ws: WebSocket): number => {
	if (db.connections.length > 0) {
		const id = db.connections[db.connections.length - 1].id + 1;
		if (db.players.length > 0) {
			const playerId = db.players[db.players.length - 1].id + 1;
			db.connections.push({ id, playerId, ws });
			return id;
		} else {
			const playerId = 1;
			db.connections.push({ id, playerId, ws });
			return id;
		}
	} else {
		const id = 1;
		if (db.players.length > 0) {
			const playerId = db.players[db.players.length - 1].id + 1;
			db.connections.push({ id, playerId, ws });
			return id;
		} else {
			const playerId = 1;
			db.connections.push({ id, playerId, ws });
			return id;
		}
	}
};

export const removeConnection = (id: number): void => {
	const index = db.connections.findIndex((connection) => connection.id === id);
	if (index !== -1) {
		db.connections.splice(index, 1);
	}
};
