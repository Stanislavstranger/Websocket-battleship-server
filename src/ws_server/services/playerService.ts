import db from '../data/db';
import { Player, Players } from '../models/models';

export const createPlayer = (name: string, password: string): Players => {
	const player = { id: db.players.length + 1, name, password };
	db.players.push(player);
	return player;
};

export const getPlayerByNameAndPassword = (name: string, password: string): Player | undefined => {
	return db.players.find((player) => player.name === name && player.password === password);
};
