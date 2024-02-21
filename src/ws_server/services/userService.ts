import { Player, RegisteredPlayer } from '../models/Player';
import { v4 as uuidv4 } from 'uuid';

export const players: RegisteredPlayer[] = [];

export const registerPlayer = (name: string): RegisteredPlayer => {
	const newPlayer: RegisteredPlayer = { name, id: uuidv4() };
	players.push(newPlayer);
	return newPlayer;
};
