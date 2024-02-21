import { Player } from '../models/Player';

export const players: Player[] = [];

export const registerPlayer = (name: string, password: string): Player => {
	const newPlayer: Player = { name, password };
	players.push(newPlayer);
	return newPlayer;
};
