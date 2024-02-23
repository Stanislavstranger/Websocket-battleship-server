import { Player } from '../models/models';
import { createPlayer, getPlayerByName } from '../services/playerService';

export const validatePlayerRegistration = (data: Player): boolean => {
	const { name, password } = data;
	if (!name || !password || name.length < 5 || password.length < 5) {
		return false;
	}

	const player = getPlayerByName(name);

	if (!player) {
		createPlayer(name, password);
		return true;
	}

	if (player.password !== password) {
		return false;
	}

	return true;
};
