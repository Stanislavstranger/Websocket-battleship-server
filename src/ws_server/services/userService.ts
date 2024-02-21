import { RegisteredPlayer } from '../models/models';
import { v4 as uuidv4 } from 'uuid';

export const players: RegisteredPlayer[] = [];

export const registerPlayer = (name: string, password: string): RegisteredPlayer => {
	const newPlayer: RegisteredPlayer = { name, password, id: +uuidv4() };
	players.push(newPlayer);
	return newPlayer;
};
