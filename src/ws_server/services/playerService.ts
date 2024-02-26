import db from '../data/db';
import { Connections, Players } from '../models/models';
import { addConnection } from './connectionService';

export const createPlayer = (name: string, password: string, ws: WebSocket): Players => {
	const player = { id: db.players.length + 1, name, password };
	db.players.push(player);
	addConnection(player.id, ws as any);
	return player;
};

export const getPlayerByName = (name: string): Players | undefined => {
	return db.players.find((player) => player.name === name);
};

export const getPlayerByWs = (ws: WebSocket): Connections | undefined => {
	const result = db.connections.find((connect) => connect.ws === ws);
	return result;
};

export const getPlayerById = (id: number): Connections | undefined => {
	const result = db.connections.find((connect) => connect.playerId === id);
	return result;
};
