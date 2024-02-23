import db from '../data/db';
import { Connections, Player, Players } from '../models/models';

export const createPlayer = (name: string, password: string): Players => {
	const player = { id: db.players.length + 1, name, password };
	db.players.push(player);
	return player;
};

export const getPlayerByName = (name: string): Player | undefined => {
	return db.players.find((player) => player.name === name);
};

export const findPlayerByWs = (ws: WebSocket): Connections | undefined => {
	const result = db.connections.find((connect) => connect.ws === ws);
	return result;
};

export const findPlayerById = (id: number): Connections | undefined => {
	const result = db.connections.find((connect) => connect.playerId === id);
	return result;
};
