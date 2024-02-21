import { Player } from '../models/models';
import db from '../data/db';
import { createPlayer } from '../services/playerService';

export const validatePlayerRegistration = (data: Player): boolean => {
	const { players } = db;
	if (!data.name || !data.password || data.name.length < 5 || data.password.length < 5) {
		return false;
	}

	const existingPlayer = players.find(
		(player) => player.name === data.name && player.password === data.password,
	);

	if (!existingPlayer) {
		createPlayer(data.name, data.password);
	}
	return true;
};
