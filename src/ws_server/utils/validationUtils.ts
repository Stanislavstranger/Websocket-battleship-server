import { Player } from '../models/models';
import db from '../data/db';

export const validatePlayerRegistration = (data: Player): boolean => {
	const { players } = db;
	if (!data.name || !data.password || data.name.length < 5 || data.password.length < 5) {
		return false;
	}
	const existingPlayer = players.find((player) => player.name === data.name);
	if (existingPlayer) {
		return false;
	}
	return true;
};
